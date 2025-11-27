import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useStore } from "../store";

let handLandmarker: HandLandmarker | null = null;
let animationId: number;

export const initializeHandTracking = async (
  video: HTMLVideoElement,
  onResult: (detected: boolean, distance: number) => void
) => {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });

    startDetecting(video, onResult);
    useStore.getState().setLoading(false);
  } catch (error) {
    console.error("Error initializing hand tracking:", error);
    useStore.getState().setLoading(false);
  }
};

const startDetecting = (
  video: HTMLVideoElement,
  onResult: (detected: boolean, distance: number) => void
) => {
  let lastVideoTime = -1;

  const predict = () => {
    if (handLandmarker && video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const results = handLandmarker.detectForVideo(video, performance.now());

      if (results.landmarks && results.landmarks.length > 0) {
        // Get the first detected hand
        const hand = results.landmarks[0];
        
        // Calculate distance between Thumb Tip (4) and Index Finger Tip (8)
        // Coordinates are normalized [0, 1]
        const thumbTip = hand[4];
        const indexTip = hand[8];

        const dx = thumbTip.x - indexTip.x;
        const dy = thumbTip.y - indexTip.y;
        const dz = thumbTip.z - indexTip.z; // Z is relative depth

        // Euclidean distance
        const rawDist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        // Normalize distance roughly for interaction (0.02 is touching, 0.2 is wide open usually)
        // We want 0 = closed, 1 = open
        const clampedDist = Math.min(Math.max(rawDist, 0.02), 0.25);
        const normalized = (clampedDist - 0.02) / (0.25 - 0.02);

        onResult(true, normalized);
      } else {
        onResult(false, 1); // Default to open if no hand
      }
    }
    animationId = requestAnimationFrame(predict);
  };

  predict();
};

export const stopHandTracking = () => {
  if (animationId) cancelAnimationFrame(animationId);
  if (handLandmarker) {
    handLandmarker.close();
    handLandmarker = null;
  }
};
