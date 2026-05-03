import React, { memo, useMemo, ReactNode } from 'react';

/**
 * Props for the individual StatItem component.
 */
interface StatItemProps {
  /** The value to display (e.g., "100%"). */
  value: string;
  /** The descriptive label for the statistic. */
  label: string;
  /** ARIA label for screen readers to provide context. */
  aria: string;
}

/**
 * Props for the StatsContainer component.
 */
interface StatsProps {
  /** Stat items to render within the container. */
  children: ReactNode;
  /** Optional ARIA label for the statistics list. */
  ariaLabel?: string;
}

/**
 * Static data for the statistics section.
 */
const STATS_DATA: StatItemProps[] = [
  { value: '97Cr+', label: 'Registered Voters',    aria: '97 crore registered voters in India' },
  { value: '543',   label: 'Lok Sabha Seats',       aria: '543 Lok Sabha constituencies' },
  { value: '7',     label: 'Election Phases (2024)',aria: '7 phases in the 2024 Lok Sabha election' },
  { value: '100%',  label: 'Free to Access',        aria: '100 percent free to access' },
];

/** 
 * Single statistic display item.
 * 
 * @component
 */
const StatItem: React.FC<StatItemProps> = memo(({ value, label, aria }) => {
  return (
    <div className="stat-item reveal" role="listitem">
      <div className="stat-num" aria-label={aria}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
});

StatItem.displayName = 'StatItem';

/** 
 * Container component for stats items.
 * Implements the compound component pattern.
 * 
 * @component
 */
const StatsContainer: React.FC<StatsProps> = memo(({ children, ariaLabel = "Key statistics about ElectED" }) => {
  return (
    <div className="stats" role="list" aria-label={ariaLabel}>
      {children}
    </div>
  );
});

StatsContainer.displayName = 'StatsContainer';

/**
 * Combined Stats component using the Compound Component Pattern.
 */
const Stats = Object.assign(StatsContainer, {
  Item: StatItem,
});

/** 
 * Main statistics section component.
 * Maps through the statistics data and renders the compound Stats component.
 * 
 * @component
 */
export const StatsSection: React.FC = memo(() => {
  const stats = useMemo(() => STATS_DATA, []);

  return (
    <Stats ariaLabel="Key statistics about ElectED">
      {stats.map((stat) => (
        <Stats.Item key={stat.label} {...stat} />
      ))}
    </Stats>
  );
});

StatsSection.displayName = 'StatsSection';

export { Stats, STATS_DATA };
