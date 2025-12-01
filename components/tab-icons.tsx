import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

export function CalendarIcon({ color, size = 28 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="15" rx="2" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M3 10h18" stroke={color} strokeWidth="2" />
      <Path d="M8 3v4M16 3v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="8" cy="14" r="1" fill={color} />
      <Circle cx="12" cy="14" r="1" fill={color} />
      <Circle cx="16" cy="14" r="1" fill={color} />
      <Circle cx="8" cy="18" r="1" fill={color} />
      <Circle cx="12" cy="18" r="1" fill={color} />
    </Svg>
  );
}

export function ChartIcon({ color, size = 28 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M7 17V12M12 17V7M17 17v-5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function ProfileIcon({ color, size = 28 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none" />
      <Path
        d="M5 20c0-4 3-7 7-7s7 3 7 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function SalonIcon({ color, size = 28 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10h18v11H3z" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M12 3v7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M8 7l4-4 4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M7 14h2M15 14h2M7 18h2M15 18h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
