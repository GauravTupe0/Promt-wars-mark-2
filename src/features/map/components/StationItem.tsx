import { memo } from 'react';
import { formatDistance } from '@/utils/geo';
import { StationItemProps } from '../types';

/** Single polling station row in the station list. */
const StationItemComponent = ({ station, isSelected, onSelect }: StationItemProps) => {
  const address = (station as { address?: string }).address;
  const hasAddress = address && address !== 'Address unavailable';

  return (
    <button
      className={`station-item${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(station)}
      aria-label={`${station.name}, ${station.type}. Distance: ${formatDistance(station.distanceKm)}. Travel time: ${station.driveMinutes} minutes by car, ${station.walkMinutes} minutes walking.`}
      aria-current={isSelected ? 'location' : undefined}
      aria-pressed={isSelected}
    >
      <div className="station-item-left">
        <div className="station-dot" aria-hidden="true" />
        <div>
          <div className="station-name">{station.name}</div>
          <div className="station-type">{station.type}</div>
          {hasAddress && (
            <div className="station-address">{address}</div>
          )}
        </div>
      </div>
      <div className="station-times">
        <div className="station-time">🚗 {station.driveMinutes} min</div>
        <div className="station-time station-walk">🚶 {station.walkMinutes} min</div>
        <div className="station-dist">{formatDistance(station.distanceKm)}</div>
      </div>
    </button>
  );
};

export const StationItem = memo(StationItemComponent);
