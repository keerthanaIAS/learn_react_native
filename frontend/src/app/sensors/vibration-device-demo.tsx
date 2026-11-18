import { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Platform,
    Vibration
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Device from 'expo-device';

export default function VibrationDeviceDemo() {
    const [deviceInfo, setDeviceInfo] = useState({
        brand: '',
        modelName: '',
        osName: '',
        osVersion: '',
        deviceType: '',
        isDevice: false,
    });

    useEffect(() => {
        // ---- Device Info (sync, no permission) ----
        setDeviceInfo({
            brand: Device.brand ?? 'Unknown',
            modelName: Device.modelName ?? 'Unknown',
            osName: Device.osName ?? 'Unknown',
            osVersion: Device.osVersion ?? 'Unknown',
            deviceType: deviceTypeToString(Device.deviceType),
            isDevice: Device.isDevice,
        });
    }, []);

    const vibrate = async (type: 'light' | 'medium' | 'heavy' | 'select') => {
        try {
            if (Platform.OS === 'ios') {
                if (type === 'light') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (type === 'medium') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (type === 'heavy') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                if (type === 'select') await Haptics.selectionAsync();
            } else {
                // Android: use PATTERN array [wait, vibrate, wait, vibrate, ...]
                // Even short vibrations work because the pattern keeps motor alive
                const patterns = {
                    light: [0, 80],
                    medium: [0, 120],
                    heavy: [0, 200],
                    select: [0, 80, 60, 80],
                };
                Vibration.vibrate(patterns[type]);
            }
        } catch (error) {
            console.log('Vibration error:', error);
        }
    };

    const deviceTypeToString = (type: Device.DeviceType | null): string => {
        switch (type) {
            case Device.DeviceType.PHONE: return '📱 Phone';
            case Device.DeviceType.TABLET: return '💻 Tablet';
            case Device.DeviceType.DESKTOP: return '🖥️ Desktop';
            case Device.DeviceType.TV: return '📺 TV';
            default: return '❓ Unknown';
        }
    };

    // ---- Vibration (haptics) ----
    const lightTap = () => vibrate('light');
    const mediumTap = () => vibrate('medium');
    const heavyTap = () => vibrate('heavy');
    const selectionTap = () => vibrate('select');
    const successVibrate = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); };
    const warningVibrate = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); };
    const errorVibrate = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Vibration + Device Info</Text>

            {/* ---- Device Info card ---- */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📱 Device Info</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Brand</Text>
                    <Text style={styles.value}>{deviceInfo.brand}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Model</Text>
                    <Text style={styles.value}>{deviceInfo.modelName}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>OS</Text>
                    <Text style={styles.value}>
                        {deviceInfo.osName} {deviceInfo.osVersion}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.value}>{deviceInfo.deviceType}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Real device?</Text>
                    <Text style={styles.value}>
                        {deviceInfo.isDevice ? '✅ Yes' : '❌ No (emulator)'}
                    </Text>
                </View>
            </View>

            {/* ---- Vibration buttons ---- */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📳 Haptics (Vibration)</Text>

                <View style={styles.buttonRow}>
                    <Pressable style={styles.smallButton} onPress={lightTap}>
                        <Text style={styles.smallButtonText}>Light</Text>
                    </Pressable>

                    <Pressable style={styles.smallButton} onPress={mediumTap}>
                        <Text style={styles.smallButtonText}>Medium</Text>
                    </Pressable>

                    <Pressable style={styles.smallButton} onPress={heavyTap}>
                        <Text style={styles.smallButtonText}>Heavy</Text>
                    </Pressable>
                </View>

                <View style={styles.buttonRow}>
                    <Pressable
                        style={[styles.smallButton, { backgroundColor: '#16A34A' }]}
                        onPress={successVibrate}
                    >
                        <Text style={styles.smallButtonText}>Success</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.smallButton, { backgroundColor: '#F59E0B' }]}
                        onPress={warningVibrate}
                    >
                        <Text style={styles.smallButtonText}>Warning</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.smallButton, { backgroundColor: '#DC2626' }]}
                        onPress={errorVibrate}
                    >
                        <Text style={styles.smallButtonText}>Error</Text>
                    </Pressable>
                </View>

                <Pressable style={styles.button} onPress={selectionTap}>
                    <Text style={styles.buttonText}>Selection Tap</Text>
                </Pressable>
            </View>

            {Platform.OS === 'web' && (
                <Text style={styles.note}>
                    ⚠️ Vibration doesn't work on web browsers.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F2F5FA' },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: { fontSize: 14, color: '#666' },
    value: { fontSize: 14, fontWeight: '600' },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    smallButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        padding: 12,
        borderRadius: 8,
    },
    smallButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 13,
    },
    button: {
        backgroundColor: '#64748B',
        padding: 14,
        borderRadius: 8,
        marginTop: 4,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    note: {
        color: '#DC2626',
        textAlign: 'center',
        fontSize: 12,
        marginTop: 10,
    },
});