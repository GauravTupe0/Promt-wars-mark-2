import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { PollMap } from './PollMap';
import * as geolocationHook from '@/hooks/useGeolocation';
import { fetchWeather } from '@/services/weatherService';
import { reverseGeocode } from '@/services/geocodeService';
import { fetchRealPollingStations, buildPollingStations } from '@/services/pollingStationsService';

// Mock dependencies
jest.mock('@googlemaps/js-api-loader', () => {
  const mockGoogle = {
    maps: {
      Map: jest.fn().mockImplementation(() => ({
        panTo: jest.fn(),
        setZoom: jest.fn(),
      })),
      Marker: jest.fn().mockImplementation(() => ({
        setMap: jest.fn(),
        addListener: jest.fn(),
        position: { lat: 0, lng: 0 },
      })),
      InfoWindow: jest.fn().mockImplementation(() => ({
        open: jest.fn(),
        setContent: jest.fn(),
      })),
      DirectionsRenderer: jest.fn().mockImplementation(() => ({
        setMap: jest.fn(),
        setDirections: jest.fn(),
      })),
      DirectionsService: jest.fn().mockImplementation(() => ({
        route: jest.fn().mockImplementation((req, cb) => cb({ routes: [{ legs: [{ distance: { text: '1 km' }, duration: { text: '10 min' } }] }] }, 'OK')),
      })),
      DirectionsStatus: { OK: 'OK' },
      TravelMode: { DRIVING: 'DRIVING' },
      SymbolPath: { CIRCLE: 0, BACKWARD_CLOSED_ARROW: 1 },
    },
  };
  (global as any).google = mockGoogle;
  return {
    Loader: jest.fn().mockImplementation(() => ({
      load: jest.fn().mockResolvedValue(mockGoogle),
    })),
  };
});

jest.mock('@/hooks/useGeolocation');
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ trackEvent: jest.fn() }),
}));
jest.mock('@/services/weatherService');
jest.mock('@/services/geocodeService');
jest.mock('@/services/pollingStationsService');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('PollMap Component', () => {
  const mockLocate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchWeather as jest.Mock).mockResolvedValue({ temp: 25, condition: 'Sunny' });
    (reverseGeocode as jest.Mock).mockResolvedValue('Test City');
    (fetchRealPollingStations as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Station 1', lat: 10, lng: 10, driveMinutes: 5, walkMinutes: 10, distanceKm: 1, type: 'School' }
    ]);
    (buildPollingStations as jest.Mock).mockReturnValue([
      { id: 'fallback-1', name: 'Fallback Station', lat: 11, lng: 11, driveMinutes: 8, walkMinutes: 15, distanceKm: 2, type: 'Hall' }
    ]);
  });

  it('renders the initial locate button when idle', () => {
    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'idle',
      userPosition: null,
      locate: mockLocate,
    });

    render(<PollMap />, { wrapper });
    expect(screen.getByText(/Find My Polling Station/i)).toBeInTheDocument();
    
    const btn = screen.getByRole('button', { name: /Find My Polling Station/i });
    fireEvent.click(btn);
    expect(mockLocate).toHaveBeenCalled();
  });

  it('renders map and stations and handles interactions', async () => {
    const user = userEvent.setup();
    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'ready',
      userPosition: { lat: 12.34, lng: 56.78 },
      locate: mockLocate,
    });

    render(<PollMap />, { wrapper });

    const [observerCallback] = (window.IntersectionObserver as jest.Mock).mock.calls[0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Station 1/i).length).toBeGreaterThan(0);
    });

    // Sidebar selection
    const stationBtn = screen.getByRole('button', { name: /Station 1/i });
    await user.click(stationBtn);
    expect(window.google.maps.Map).toHaveBeenCalled();

    // Marker interaction
    const markerMock = (window.google.maps.Marker as jest.Mock);
    const stationMarker = markerMock.mock.results.map(r => r.value).find(m => m && m.addListener);

    if (stationMarker) {
      const clickCalls = stationMarker.addListener.mock.calls.filter(c => c[0] === 'click');
      if (clickCalls.length > 0) {
        act(() => {
          clickCalls[0][1]();
        });
        expect(window.google.maps.InfoWindow).toHaveBeenCalled();
        expect(screen.getByText(/Station 1/i)).toBeInTheDocument();
      }
    }

    // Directions service should be called
    expect(window.google.maps.DirectionsService).toHaveBeenCalled();
  });

  it('handles errors gracefully', async () => {
    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'ready',
      userPosition: { lat: 12.34, lng: 56.78 },
      locate: mockLocate,
    });
    (reverseGeocode as jest.Mock).mockRejectedValue(new Error('Geocode failed'));
    (fetchRealPollingStations as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    render(<PollMap />, { wrapper });

    const [observerCallback] = (window.IntersectionObserver as jest.Mock).mock.calls[0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Fallback Station/i).length).toBeGreaterThan(0);
    });
  });

  it('shows error message when map fails to load', async () => {
    const loaderModule = require('@googlemaps/js-api-loader');
    loaderModule.Loader.mockImplementationOnce(() => ({
      load: jest.fn().mockRejectedValue(new Error('API Key Invalid')),
    }));

    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'ready',
      userPosition: { lat: 12.34, lng: 56.78 },
      locate: mockLocate,
    });

    render(<PollMap />, { wrapper });

    const [observerCallback] = (window.IntersectionObserver as jest.Mock).mock.calls[0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(screen.getByText(/API Key Invalid/i)).toBeInTheDocument();
    });
  });

  it('uses fallback when real stations are empty', async () => {
    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'ready',
      userPosition: { lat: 12.34, lng: 56.78 },
      locate: mockLocate,
    });
    (fetchRealPollingStations as jest.Mock).mockResolvedValue([]);

    render(<PollMap />, { wrapper });

    const [observerCallback] = (window.IntersectionObserver as jest.Mock).mock.calls[0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(screen.getByText(/Fallback Station/i)).toBeInTheDocument();
    });
  });
});
