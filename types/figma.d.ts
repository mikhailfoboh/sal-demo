export interface FigmaFrame {
  id: string;
  name: string;
  type: string;
  children?: FigmaFrame[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  backgroundColor?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  styles?: {
    [key: string]: string;
  };
}

export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: {
    id: string;
    name: string;
    type: string;
    children: FigmaFrame[];
  };
}