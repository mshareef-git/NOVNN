import { NativeModule, requireNativeModule, requireOptionalNativeModule } from 'expo';

declare class PoseTrackerModule extends NativeModule<{}> {}

let poseTrackerModule: PoseTrackerModule | null = null;
try {
  if (typeof requireOptionalNativeModule === 'function') {
    poseTrackerModule = requireOptionalNativeModule<PoseTrackerModule>('PoseTracker');
  } else {
    poseTrackerModule = requireNativeModule<PoseTrackerModule>('PoseTracker');
  }
} catch {
  // In Expo Go or platforms without the custom native code, gracefully fallback to null
  poseTrackerModule = null;
}

export default poseTrackerModule;
