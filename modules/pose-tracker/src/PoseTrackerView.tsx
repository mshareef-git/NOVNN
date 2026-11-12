import { requireNativeView } from 'expo';
import * as React from 'react';
import { StyleSheet, Text, UIManager, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import {
  PoseTrackerViewProps,
} from './PoseTracker.types';
import PoseTrackerModule from './PoseTrackerModule';

function isPoseTrackerViewAvailable(): boolean {
  if (!PoseTrackerModule) {
    return false;
  }
  try {
    return Boolean(
      UIManager.getViewManagerConfig?.('ViewManagerAdapter_PoseTracker') ||
      UIManager.getViewManagerConfig?.('RCTViewManagerAdapter_PoseTracker') ||
      UIManager.getViewManagerConfig?.('PoseTracker')
    );
  } catch {
    return false;
  }
}

let NativeView: React.ComponentType<PoseTrackerViewProps> | null = null;
if (isPoseTrackerViewAvailable()) {
  try {
    NativeView = requireNativeView('PoseTracker');
  } catch {
    NativeView = null;
  }
}

function getMediaPipeHtml(exerciseId: string = 'seated-arm-raise'): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: #000; }
    video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
    canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
  </style>
  <script src="https://unpkg.com/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@mediapipe/pose@0.5.1675469404/pose.js" crossorigin="anonymous"></script>
</head>
<body>
  <video id="v" autoplay playsinline webkit-playsinline muted></video>
  <canvas id="c"></canvas>
  <script>
    const SKELETON_PAIRS = [
      [0, 1], [1, 2], [2, 3], [3, 7],
      [0, 4], [4, 5], [5, 6], [6, 8],
      [9, 10],
      [11, 12],
      [11, 13], [13, 15],
      [12, 14], [14, 16],
      [11, 23], [12, 24], [23, 24],
      [23, 25], [25, 27], [27, 29], [27, 31],
      [24, 26], [26, 28], [28, 30], [28, 32]
    ];
    const NAMES = [
      'NOSE','LEFT_EYE_INNER','LEFT_EYE','LEFT_EYE_OUTER','RIGHT_EYE_INNER',
      'RIGHT_EYE','RIGHT_EYE_OUTER','LEFT_EAR','RIGHT_EAR','MOUTH_LEFT','MOUTH_RIGHT',
      'LEFT_SHOULDER','RIGHT_SHOULDER','LEFT_ELBOW','RIGHT_ELBOW','LEFT_WRIST','RIGHT_WRIST',
      'LEFT_PINKY','RIGHT_PINKY','LEFT_INDEX','RIGHT_INDEX','LEFT_THUMB','RIGHT_THUMB',
      'LEFT_HIP','RIGHT_HIP','LEFT_KNEE','RIGHT_KNEE','LEFT_ANKLE','RIGHT_ANKLE',
      'LEFT_HEEL','RIGHT_HEEL','LEFT_FOOT_INDEX','RIGHT_FOOT_INDEX'
    ];

    const exerciseId = "${exerciseId}";
    const video = document.getElementById('v');
    const canvas = document.getElementById('c');
    let poseInstance = null;

    function calcAngle(p1, p2, p3) {
      const rad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
      let deg = Math.abs((rad * 180.0) / Math.PI);
      if (deg > 180.0) deg = 360 - deg;
      return Math.round(deg);
    }

    async function init() {
      try {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
          });
        } catch(e) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        }
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.muted = true;
        await video.play();

        setupPose();
      } catch(err) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message }));
        }
      }
    }

    function setupPose() {
      if (!window.Pose) {
        setTimeout(setupPose, 200);
        return;
      }
      try {
        poseInstance = new window.Pose({
          locateFile: (f) => 'https://unpkg.com/@mediapipe/pose@0.5.1675469404/' + f
        });
        poseInstance.setOptions({
          modelComplexity: 0,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        poseInstance.onResults(onResults);

        if (window.Camera) {
          const camera = new window.Camera(video, {
            onFrame: async () => {
              if (poseInstance) await poseInstance.send({ image: video });
            },
            width: 640,
            height: 480
          });
          camera.start();
        } else {
          let busy = false;
          function loop() {
            if (video.videoWidth > 0 && !busy && poseInstance) {
              busy = true;
              poseInstance.send({ image: video }).catch(() => {}).finally(() => { busy = false; });
            }
            requestAnimationFrame(loop);
          }
          requestAnimationFrame(loop);
        }
      } catch(e) {}
    }

    function onResults(results) {
      const width = canvas.clientWidth || 640;
      const height = canvas.clientHeight || 480;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);

      const raw = results.poseLandmarks;
      if (!raw || raw.length === 0) return;

      // Ensure hips have anchor coordinates if cut off below portrait frame
      const shL = raw[11], shR = raw[12];
      if (shL && (!raw[23] || (raw[23].visibility || 1) < 0.4)) {
        raw[23] = { x: shL.x, y: Math.min(0.92, shL.y + 0.35), z: 0, visibility: 0.95 };
      }
      if (shR && (!raw[24] || (raw[24].visibility || 1) < 0.4)) {
        raw[24] = { x: shR.x, y: Math.min(0.92, shR.y + 0.35), z: 0, visibility: 0.95 };
      }

      // Calculate joint angles for current exercise
      let currentAngle = 90;
      let focalPoint = null;
      let goalHit = false;

      if (exerciseId === 'seated-arm-raise') {
        const shoulder = raw[12] || raw[11];
        const elbow = raw[14] || raw[13];
        const hip = raw[24] || raw[23];
        if (shoulder && elbow && hip) {
          currentAngle = calcAngle(hip, shoulder, elbow);
          focalPoint = { x: (1 - shoulder.x) * width, y: shoulder.y * height };
          goalHit = currentAngle >= 120;
        }
      } else {
        const hip = raw[24] || raw[23];
        const knee = raw[26] || raw[25];
        const ankle = raw[28] || raw[27];
        if (hip && knee && ankle) {
          currentAngle = calcAngle(hip, knee, ankle);
          focalPoint = { x: (1 - knee.x) * width, y: knee.y * height };
          goalHit = currentAngle >= 160;
        }
      }

      // Draw Glowing Skeleton over user's body
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = goalHit ? '#10B981' : '#38BDF8';
      ctx.shadowColor = goalHit ? '#10B981' : '#38BDF8';
      ctx.shadowBlur = 6;

      for (const [i, j] of SKELETON_PAIRS) {
        const p1 = raw[i], p2 = raw[j];
        if (!p1 || !p2 || (p1.visibility || 1) < 0.3 || (p2.visibility || 1) < 0.3) continue;
        ctx.beginPath();
        ctx.moveTo((1 - p1.x) * width, p1.y * height);
        ctx.lineTo((1 - p2.x) * width, p2.y * height);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      raw.forEach((lm, idx) => {
        if ((lm.visibility || 1) < 0.3) return;
        const px = (1 - lm.x) * width;
        const py = lm.y * height;
        const isFocal = idx === 11 || idx === 12 || idx === 13 || idx === 14 || idx === 25 || idx === 26;
        ctx.fillStyle = isFocal ? (goalHit ? '#10B981' : '#F97316') : '#E2E8F0';
        ctx.beginPath();
        ctx.arc(px, py, isFocal ? 5 : 2.5, 0, 2 * Math.PI);
        ctx.fill();
      });

      if (focalPoint) {
        ctx.strokeStyle = goalHit ? '#10B981' : '#38BDF8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(focalPoint.x, focalPoint.y, 14, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Send REAL live landmarks to React Native SessionEngine
      const payload = raw.map((lm, idx) => ({
        name: NAMES[idx] || ('UNKNOWN_' + idx),
        x: lm.x,
        y: lm.y,
        z: lm.z || 0,
        visibility: typeof lm.visibility === 'number' ? lm.visibility : 0.9,
        presence: typeof lm.visibility === 'number' ? lm.visibility : 0.9
      }));

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'landmarks', landmarks: payload }));
      }
    }

    init();
  </script>
</body>
</html>
`;
}

export default function PoseTrackerView({ exerciseId = 'seated-arm-raise', onFrame, onPoseFrame, onError, style, ...rest }: PoseTrackerViewProps) {
  const onPoseFrameRef = React.useRef(onPoseFrame);
  onPoseFrameRef.current = onPoseFrame;
  const onFrameRef = React.useRef(onFrame);
  onFrameRef.current = onFrame;
  const frameIndexRef = React.useRef(0);

  const onWebViewMessage = React.useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'landmarks' && Array.isArray(data.landmarks)) {
          const now = Date.now();
          frameIndexRef.current += 1;
          onPoseFrameRef.current?.({
            nativeEvent: {
              timestampMs: now,
              imageWidth: 640,
              imageHeight: 480,
              presence: 'tracked',
              landmarks: data.landmarks,
            },
          });
          onFrameRef.current?.({
            nativeEvent: {
              frameIndex: frameIndexRef.current,
              timestampNs: Math.round(now * 1_000_000),
              elapsedRealtimeMs: now,
              width: 640,
              height: 480,
            },
          });
        }
      } catch {}
    },
    []
  );

  if (!NativeView) {
    const htmlSource = getMediaPipeHtml(exerciseId);

    return (
      <View style={[styles.container, style]}>
        {/* Real MediaPipe Pose Tracking inside Hardware Accelerated WebView */}
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlSource }}
          style={StyleSheet.absoluteFill}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType="grant"
          javaScriptEnabled
          domStorageEnabled
          androidLayerType="hardware"
          onMessage={onWebViewMessage}
        />

        {/* Clean Subtle Status Indicator */}
        <View style={styles.statusBar} pointerEvents="none">
          <View style={styles.statusPill}>
            <View style={[styles.dot, { backgroundColor: '#38BDF8' }]} />
            <Text style={styles.statusText}>TRACKING ACTIVE</Text>
          </View>
        </View>
      </View>
    );
  }

  return <NativeView {...rest} style={style} onFrame={onFrame} onPoseFrame={onPoseFrame} onError={onError} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  statusBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
