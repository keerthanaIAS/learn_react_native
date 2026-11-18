import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Vibration,
    Platform,
    ScrollView,
} from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';

// Physical constants for step calculation
const STRIDE_LENGTH_M = 0.7;      // average adult step ~0.7m
const CALORIES_PER_STEP = 0.04;   // ~0.04 kcal per step
const STEP_THRESHOLD = 1.2;       // Z-axis threshold to count a step
const STEP_DELTA_THRESHOLD = 0.35; // Net acceleration spike above resting gravity (1.0g)
const MIN_STEP_INTERVAL_MS = 400;  // Max ~2.5 steps/sec (prevents 1 move = 3 steps)
const GOAL = 10000;

export default function FitnessDemo() {
    const [isTracking, setIsTracking] = useState(false);
    const [steps, setSteps] = useState(0);
    const [liveAccel, setLiveAccel] = useState({ x: 0, y: 0, z: 0 });

    const wasAboveThreshold = useRef(false);
    const lastStepTime = useRef(0);
    const progress = Math.min(steps / GOAL, 1);

    // Subscribe to Gyroscope for shake-to-reset
    useEffect(() => {
        if (!isTracking) return;

        Gyroscope.setUpdateInterval(100);
        const sub = Gyroscope.addListener((data) => {
            const total = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
            if (total > 5) {
                setSteps(0);
                lastStepTime.current = 0;
                wasAboveThreshold.current = false;
            }
        });

        return () => sub.remove();
    }, [isTracking]);

    // Subscribe to Accelerometer for step counting
    useEffect(() => {
        if (!isTracking) return;

        Accelerometer.setUpdateInterval(100); // 10 updates/second

        const subscription = Accelerometer.addListener((data) => {
            setLiveAccel(data);
            // 1. Total 3D acceleration magnitude (works regardless of phone tilt/orientation)
            const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
            // 2. Subtract resting Earth gravity (~1.0g) to get net movement force
            const netAcceleration = Math.abs(magnitude - 1.0);
            // 3. Detect a clear walking impact peak
            const now = Date.now();
            const isStepPeak = netAcceleration > STEP_DELTA_THRESHOLD;

            if (
                isStepPeak &&
                !wasAboveThreshold.current &&
                now - lastStepTime.current > MIN_STEP_INTERVAL_MS
            ) {
                setSteps((prev) => prev + 1);
                lastStepTime.current = now;

                if (Platform.OS === 'android') {
                    Vibration.vibrate(50);
                }
            }
            wasAboveThreshold.current = isStepPeak;
        });
        return () => subscription.remove();
    }, [isTracking]);

    const distanceM = steps * STRIDE_LENGTH_M;
    const calories = steps * CALORIES_PER_STEP;

    const handleToggle = () => {
        if (isTracking) {
            setIsTracking(false);
        } else {
            setSteps(0);
            lastStepTime.current = 0;
            wasAboveThreshold.current = false;
            setIsTracking(true);
        }
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
            <Text style={styles.heading}>🏃 Fitness Tracker</Text>

            {/* Status */}
            <View style={styles.statusCard}>
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: isTracking ? '#16A34A' : '#94A3B8' },
                    ]}
                />
                <Text style={styles.statusText}>
                    {isTracking ? 'Tracking steps...' : 'Not tracking'}
                </Text>
            </View>

            {/* Big step counter */}
            <View style={styles.stepCard}>
                <Text style={styles.stepLabel}>STEPS</Text>
                <Text style={styles.stepNumber}>{steps}</Text>
            </View>

            {/* Stats grid */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statIcon}>📍</Text>
                    <Text style={styles.statValue}>{distanceM.toFixed(1)} m</Text>
                    <Text style={styles.statLabel}>Distance</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statIcon}>🔥</Text>
                    <Text style={styles.statValue}>{calories.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>Calories</Text>
                </View>
            </View>

            {/* Goal Progress Bar (always visible safely without falsy 0 bug) */}
            <View style={styles.progressSection}>
                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progress * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {Math.round(progress * 100)}% of 10,000 goal
                </Text>
            </View>

            {/* Live accelerometer */}
            {isTracking && (
                <View style={styles.debugCard}>
                    <Text style={styles.debugTitle}>📊 Live Accelerometer</Text>
                    <View style={styles.debugRow}>
                        <Text style={styles.debugLabel}>X</Text>
                        <Text style={styles.debugValue}>{liveAccel.x.toFixed(2)}</Text>
                    </View>
                    <View style={styles.debugRow}>
                        <Text style={styles.debugLabel}>Y</Text>
                        <Text style={styles.debugValue}>{liveAccel.y.toFixed(2)}</Text>
                    </View>
                    <View style={styles.debugRow}>
                        <Text style={styles.debugLabel}>Z</Text>
                        <Text
                            style={[
                                styles.debugValue,
                                liveAccel.z > STEP_THRESHOLD && { color: '#16A34A' },
                            ]}
                        >
                            {liveAccel.z.toFixed(2)}
                        </Text>
                    </View>
                    <Text style={styles.debugHint}>
                        Z {'>'} {STEP_THRESHOLD} = step detected • Shake phone to reset
                    </Text>
                </View>
            )}

            {/* Start / Stop button */}
            <Pressable
                style={[styles.button, isTracking && styles.stopButton]}
                onPress={handleToggle}
            >
                <Text style={styles.buttonText}>
                    {isTracking ? '⏹ Stop Tracking' : '▶️ Start Tracking'}
                </Text>
            </Pressable>

            <Text style={styles.hint}>
                Walk with phone in hand. Each step = 0.7m + 0.04 calories.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F2F5FA' },
    container: { padding: 20, paddingBottom: 40 },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },

    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    statusDot: { width: 10, height: 10, borderRadius: 5 },
    statusText: { fontSize: 14, color: '#666' },

    stepCard: {
        backgroundColor: '#2563EB',
        padding: 28,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    stepLabel: {
        color: '#93C5FD',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
    },
    stepNumber: {
        color: 'white',
        fontSize: 64,
        fontWeight: 'bold',
        marginTop: 4,
    },

    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statIcon: { fontSize: 24, marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#172554' },
    statLabel: { fontSize: 12, color: '#666', marginTop: 2 },

    progressSection: {
        marginBottom: 16,
        gap: 6,
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#16A34A',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#475569',
        textAlign: 'right',
        fontWeight: '600',
    },

    debugCard: {
        backgroundColor: '#1E293B',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    debugTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 13,
    },
    debugRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    debugLabel: { color: '#94A3B8', fontFamily: 'monospace' },
    debugValue: {
        color: 'white',
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
    debugHint: {
        color: '#64748B',
        fontSize: 11,
        marginTop: 8,
        fontStyle: 'italic',
    },

    button: {
        backgroundColor: '#16A34A',
        padding: 16,
        borderRadius: 10,
        marginTop: 8,
    },
    stopButton: { backgroundColor: '#DC2626' },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },

    hint: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 16,
    },
});


// Accelerometer and Gyroscope are used to detect steps and shakes. 
// The accelerometer measures linear acceleration along the X, Y, and Z axes, 
// while the gyroscope measures rotational movement. 
// By analyzing the data from these sensors, we can determine when a user takes a step or shakes their device.

// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Pressable,
//   StyleSheet,
// } from 'react-native';
// import { Accelerometer, Gyroscope } from 'expo-sensors';

// export default function MotionSensorsDemo() {
//   const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
//   const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
//   const [accelActive, setAccelActive] = useState(false);
//   const [gyroActive, setGyroActive] = useState(false);

//   // Accelerometer subscription
//   useEffect(() => {
//     if (!accelActive) return;

//     Accelerometer.setUpdateInterval(200); // 200ms = 5 updates/sec
//     const sub = Accelerometer.addListener(setAccelData);

//     return () => sub.remove();
//   }, [accelActive]);

//   // Gyroscope subscription
//   useEffect(() => {
//     if (!gyroActive) return;

//     Gyroscope.setUpdateInterval(200);
//     const sub = Gyroscope.addListener(setGyroData);

//     return () => sub.remove();
//   }, [gyroActive]);

//   // Detect shake (total acceleration > threshold)
//   const totalAccel = Math.sqrt(
//     accelData.x ** 2 + accelData.y ** 2 + accelData.z ** 2
//   );
//   const isShaking = totalAccel > 1.5; // gravity is ~1.0

//   // Detect rotation (any axis > threshold)
//   const totalGyro = Math.sqrt(
//     gyroData.x ** 2 + gyroData.y ** 2 + gyroData.z ** 2
//   );
//   const isRotating = totalGyro > 0.3;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Motion Sensors</Text>

//       {/* Accelerometer card */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>📳 Accelerometer</Text>
//         <Text style={styles.desc}>
//           Detects linear movement (tilt, shake)
//         </Text>

//         <View style={styles.row}>
//           <Text style={styles.axis}>X</Text>
//           <Text style={styles.value}>{accelData.x.toFixed(2)}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.axis}>Y</Text>
//           <Text style={styles.value}>{accelData.y.toFixed(2)}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.axis}>Z</Text>
//           <Text style={styles.value}>{accelData.z.toFixed(2)}</Text>
//         </View>

//         {isShaking && accelActive && (
//           <Text style={styles.alert}>🚨 SHAKE DETECTED</Text>
//         )}

//         <Pressable
//           style={[
//             styles.button,
//             accelActive && styles.activeButton,
//           ]}
//           onPress={() => setAccelActive(!accelActive)}
//         >
//           <Text style={styles.buttonText}>
//             {accelActive ? 'Stop' : 'Start'} Accelerometer
//           </Text>
//         </Pressable>
//       </View>

//       {/* Gyroscope card */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>🔄 Gyroscope</Text>
//         <Text style={styles.desc}>
//           Detects rotation (twist, turn)
//         </Text>

//         <View style={styles.row}>
//           <Text style={styles.axis}>X</Text>
//           <Text style={styles.value}>{gyroData.x.toFixed(2)}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.axis}>Y</Text>
//           <Text style={styles.value}>{gyroData.y.toFixed(2)}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.axis}>Z</Text>
//           <Text style={styles.value}>{gyroData.z.toFixed(2)}</Text>
//         </View>

//         {isRotating && gyroActive && (
//           <Text style={styles.alert}>🔄 ROTATION DETECTED</Text>
//         )}

//         <Pressable
//           style={[
//             styles.button,
//             gyroActive && styles.activeButton,
//           ]}
//           onPress={() => setGyroActive(!gyroActive)}
//         >
//           <Text style={styles.buttonText}>
//             {gyroActive ? 'Stop' : 'Start'} Gyroscope
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#F2F5FA' },
//   heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   card: {
//     backgroundColor: '#fff',
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 15,
//   },
//   cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
//   desc: { fontSize: 12, color: '#666', marginBottom: 12 },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   axis: { fontSize: 15, fontWeight: 'bold', color: '#2563EB' },
//   value: { fontSize: 15, fontFamily: 'monospace' },
//   alert: {
//     color: '#DC2626',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 12,
//   },
//   button: {
//     backgroundColor: '#2563EB',
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 12,
//   },
//   activeButton: { backgroundColor: '#DC2626' },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

// What Each Sensor Does (This Matters)
// =====================================
// Accelerometer
// =============
// Axis	Measures	Real-World
// X	Left/right tilt	Shake to undo
// Y	Forward/back tilt	Tilt to steer in games
// Z	Up/down	Detect if phone is face-down
// Gravity = 1.0 on one axis when phone is still. Values change when you move.

// Use cases:
// Shake to undo (Instagram, Notes)
// Step counter (pedometer apps)
// Tilt controls (racing games)
// Auto-rotate screen

// Gyroscope
// =========
// Axis	Measures	Real-World
// X	Rotation around X	Flip detection
// Y	Rotation around Y	Turn detection
// Z	Rotation around Z	Spin detection
// No gravity baseline — gyroscope returns 0, 0, 0 when still. Values change only when you rotate.

// Use cases:
// VR/AR head tracking
// Panorama photo alignment
// Compass stabilization
// Motion gaming