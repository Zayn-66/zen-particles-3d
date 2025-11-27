export enum ParticleShape {
  HEART = 'HEART',
  FLOWER = 'FLOWER',
  SATURN = 'SATURN',
  SPIRAL = 'SPIRAL',
  FIREWORK = 'FIREWORK'
}

export interface AppState {
  currentShape: ParticleShape;
  particleColor: string;
  isHandDetected: boolean;
  handDistance: number; // 0 (closed) to 1 (open)
  isLoading: boolean;
  
  setShape: (shape: ParticleShape) => void;
  setColor: (color: string) => void;
  setHandStatus: (detected: boolean, distance: number) => void;
  setLoading: (loading: boolean) => void;
}
