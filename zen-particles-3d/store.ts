import { create } from 'zustand';
import { AppState, ParticleShape } from './types';

export const useStore = create<AppState>((set) => ({
  currentShape: ParticleShape.HEART,
  particleColor: '#ff0066',
  isHandDetected: false,
  handDistance: 1, // Default to open
  isLoading: true,

  setShape: (shape) => set({ currentShape: shape }),
  setColor: (color) => set({ particleColor: color }),
  setHandStatus: (detected, distance) => set({ isHandDetected: detected, handDistance: distance }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
