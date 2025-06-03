declare module 'phosphor-react-native' {
  import { ComponentType } from 'react';
  
  interface IconProps {
    size?: number;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    mirrored?: boolean;
  }

  export const Calendar: ComponentType<IconProps>;
  export const CalendarCheck: ComponentType<IconProps>;
  export const Target: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const UserCircle: ComponentType<IconProps>;
  export const NotePencil: ComponentType<IconProps>;
  export const Notepad: ComponentType<IconProps>;
  export const CaretLeft: ComponentType<IconProps>;
  export const CaretRight: ComponentType<IconProps>;
  export const ArrowCircleLeft: ComponentType<IconProps>;
  export const ArrowCircleRight: ComponentType<IconProps>;
  export const ClockCounterClockwise: ComponentType<IconProps>;
  export const CheckCircle: ComponentType<IconProps>;
  export const CalendarPlus: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const PlusCircle: ComponentType<IconProps>;
  
  // Add other icons as needed
  export const Home: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const Settings: ComponentType<IconProps>;
} 