import { render, screen } from '@testing-library/react';
import { MapPlaceholder } from './MapPlaceholder';

describe('MapPlaceholder Component', () => {
  it('renders correctly without user position', () => {
    render(<MapPlaceholder userPosition={null} />);
    expect(screen.getByText(/Google Maps Not Configured/i)).toBeInTheDocument();
    expect(screen.queryByText(/Your location:/i)).not.toBeInTheDocument();
  });

  it('renders user position when provided', () => {
    render(<MapPlaceholder userPosition={{ lat: 12.34567, lng: 56.78901 }} />);
    expect(screen.getByText(/Your location: 12.3457°, 56.7890°/i)).toBeInTheDocument();
  });
});
