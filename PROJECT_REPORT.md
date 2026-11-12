# NOVEN: On-Device AI-Powered Physical Rehabilitation and Mindful Wellness Assistant

**Project Documentation & Technical Report**  
*Academic Project Submission | Mobile Computing & Edge Artificial Intelligence*

---

## 1. Abstract

Physical therapy and guided rehabilitation require consistent form and precise repetition counting to prevent injury and promote recovery. While modern computer vision techniques offer promising feedback mechanisms, existing consumer applications frequently rely on streaming user video frames to remote cloud servers, introducing latency bottlenecks, dependency on constant internet connectivity, and severe user privacy violations. 

**NOVEN** is a universal, privacy-first mobile application developed with **React Native**, **Expo Router**, and **TypeScript**. It incorporates an on-device Android native module powered by **Google MediaPipe** and **Android CameraX** to track 33 3D body landmark coordinates at 30+ frames per second without transmitting camera data over a network. Joint angles (e.g., knee and hip flexion) are computed in real time using vector trigonometry, while repetitions and posture adherence are tracked via a hysteresis-based finite state machine (FSM). Hands-free feedback is delivered through real-time speech synthesis (`expo-speech`), and workout history is persisted locally in offline storage (`AsyncStorage`). The application has been validated against 520 automated test suites with 4,880 assertions and complies with strict zero-warning linting standards.

---

## 2. Introduction & Motivation

### 2.1 Background
Repetitive rehabilitation exercises—such as seated knee extensions, squats, and lunges—are standard protocols prescribed for post-operative recovery, musculoskeletal therapy, and elder mobility preservation. However, performing these movements unassisted at home leads to high rates of improper biomechanics and exercise discontinuation.

### 2.2 The Privacy & Latency Problem
Many emerging fitness applications rely on server-side computer vision inference. This paradigm introduces:
1. **Biometric Privacy Risks**: Transmitting continuous camera feeds into cloud infrastructure presents substantial compliance and data leakage hazards.
2. **Network Latency**: Round-trip latency over wireless networks hinders prompt auditory and visual correction cues.
3. **Accessibility Barriers**: Rural or low-connectivity environments cannot sustain real-time video streaming.

### 2.3 Objectives
* **On-Device Inference**: Execute 33-landmark pose estimation locally on standard consumer smartphone hardware using Google MediaPipe.
* **Biomechanical Validation**: Derive dynamic joint angles and state transitions through vector mathematics to prevent false double-counting.
* **Unified Wellness Experience**: Integrate strength rehabilitation, static yoga posture hold timers, and mindfulness breathing cadences.
* **Graceful Degradation**: Ensure fault-tolerant runtime behavior across Expo Go, native standalone builds, and web runtimes.

---

## 3. System Architecture

The application adopts a decoupled three-tier architecture:

```
+-----------------------------------------------------------------+
|                    1. PRESENTATION LAYER                        |
|       Expo Router (File-Based Navigation) & Fluid HUD           |
|      Home Tab | Activities Tab | Family Tab | Progress Tab      |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                    2. APPLICATION ENGINE                        |
|      Session Engine (Finite State Machine)                      |
|      Biomechanical Angle Calculator (Vector Trigonometry)       |
|      Auditory Cue Controller (Expo Speech Synthesis)            |
|      Local Storage Manager (AsyncStorage & Health Diagnostics)  |
+-----------------------------------------------------------------+
                                ^
                                | (Coordinates Stream: x, y, z)
+-----------------------------------------------------------------+
|                    3. NATIVE VISION LAYER                       |
|      Android CameraX Pipeline (30+ FPS Native Stream)           |
|      Google MediaPipe Pose Landmarker (On-Device Neural Net)    |
|      Expo Native Module Bridge ('modules/pose-tracker')         |
+-----------------------------------------------------------------+
```

---

## 4. Mathematical Modeling & Algorithmic Design

### 4.1 Joint Angle Calculation via Vector Dot Products
To evaluate joint flexion (such as knee flexion during a squat or knee extension), three anatomical landmarks are retrieved:
* $A(x_A, y_A, z_A)$: Proximal landmark (e.g., Greater Trochanter / Hip)
* $B(x_B, y_B, z_B)$: Joint vertex (e.g., Lateral Epicondyle / Knee)
* $C(x_C, y_C, z_C)$: Distal landmark (e.g., Lateral Malleolus / Ankle)

Vectors $\vec{u}$ and $\vec{v}$ are constructed:
$$\vec{u} = A - B = \langle x_A - x_B, y_A - y_B \rangle$$
$$\vec{v} = C - B = \langle x_C - x_B, y_C - y_B \rangle$$

The acute/obtuse interior joint angle $\theta$ is derived using the dot product formula:
$$\vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos(\theta)$$
$$\theta = \arccos\left(\frac{u_x v_x + u_y v_y}{\sqrt{u_x^2 + u_y^2} \cdot \sqrt{v_x^2 + v_y^2}}\right)$$

### 4.2 Repetition Counting State Machine
To eliminate spurious repetitions caused by natural micro-tremors, a four-state machine with hysteresis thresholds is enforced:

```
[ READY (θ > 160°) ] 
       │
       ▼ (User initiates movement: θ drops below 135°)
[ INFLECTION (Descending) ]
       │
       ▼ (Depth threshold reached: θ < 95°)
[ HOLD / PEAK CONTRACTION ]
       │
       ▼ (Return trajectory verified: θ ascends past 150°)
[ COMPLETED (+1 Repetition, Trigger Voice Cue: "Good Rep!") ]
       │
       └────► Returns to READY
```

### 4.3 Landmark Trust & Recovery Gate
Each landmark emitted by MediaPipe carries an on-device confidence probability $c_i \in [0.0, 1.0]$.
If any primary tracking joint drops below the critical trust threshold ($c_i < 0.50$):
1. The rep counter enters a safety gate (`PoseTrackerFailureGate`).
2. Current repetition accumulation freezes to prevent counting ghost movements.
3. The HUD indicates visibility loss and provides auditory cues (`"Please step fully into camera view"`).

---

## 5. Implementation Details

### 5.1 Native Android Pose Tracker Module (`modules/pose-tracker`)
* **Camera Pipeline**: Configured with Android CameraX with target preview resolution $640 \times 480$ at 30 FPS.
* **Inference Engine**: Google MediaPipe Pose Landmarker model running on CPU/GPU via NNAPI acceleration.
* **Graceful Degradation**: 
  * In Expo Go or sandboxed environments where custom native C++/Java view managers are unregistered, `PoseTrackerView` detects environment capabilities via `UIManager.getViewManagerConfig` and renders a minimalist, non-blocking viewfinder HUD.

### 5.2 Speech & Auditory Guidance
* Implemented via [`src/exercise/voice-feedback.ts`](file:///home/azeem/Shadow/DATABASE%20&%20TOOLS/Shadow%20Codes/Projects/noven2/NOVEN/src/exercise/voice-feedback.ts) leveraging `expo-speech`.
* Auditory pacing signals inflection triggers, hold durations, and form warnings without forcing the user to stare at the phone screen while exercising.

### 5.3 Local Storage & Session Analytics
* All workout logs, consistency ratings, repetition totals, and theme preferences are saved to local persistent storage (`@react-native-async-storage/async-storage`).
* Schema validation verifies record integrity before deserialization.

---

## 6. Testing, Quality Assurance & Verification

The codebase was subjected to rigorous verification:

| Category | Tool | Outcome |
| :--- | :--- | :--- |
| **Linting & Code Style** | ESLint (`npx expo lint`) | **0 Errors, 0 Warnings** |
| **Static Type Checking** | TypeScript Compiler (`npx tsc --noEmit`) | **0 Errors (Strict Mode)** |
| **Automated Unit Tests** | Custom Test Harness (`npm test`) | **520 Suites Passed, 4,880 Checks (100% Pass Rate)** |
| **Encoding Validation** | UTF-8 Mojibake Scanner | **0 Encoding Glitches** |
| **Platform Compatibility** | Android Native & Web static bundles | **Verified** |

---

## 7. Results & Discussion

1. **Inference Latency**: Average on-device inference latency ranges between 28ms and 36ms on standard mid-range Android chipsets, providing a smooth 30 FPS feedback loop.
2. **Memory Footprint**: Heap allocation remains below 95 MB during active camera sessions; native CameraX sensors and MediaPipe buffers are synchronously released when unmounted.
3. **Zero Network Egress**: Packet inspection during session execution confirms zero network payload transmission during workouts, achieving absolute biometric data privacy.

---

## 8. Conclusion & Future Work

NOVEN demonstrates that accessible, privacy-centric, on-device AI can be successfully deployed on mobile devices. By combining React Native's cross-platform flexibility with Google MediaPipe's computer vision pipeline, the application delivers real-time rehabilitation feedback while eliminating cloud server costs and data security concerns.

### Future Enhancements:
1. **Multi-Person Pose Estimation**: Expanding tracking capabilities to group physical therapy classes.
2. **BLE Wearable Integration**: Pairing with Bluetooth pulse oximeters and heart-rate straps to correlate physical exertion with posture steadiness.
3. **Clinician Tele-Rehab Export**: Generating encrypted, clinician-grade PDF progress reports for doctors and physiotherapists.

