import { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export default function BiometricDemo() {
    const [hasHardware, setHasHardware] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [biometricType, setBiometricType] = useState('Unknown');
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkBiometrics();
    }, []);

    const checkBiometrics = async () => {
        // 1. Does device have biometric hardware?
        const hardware = await LocalAuthentication.hasHardwareAsync();
        setHasHardware(hardware);
        if (!hardware) return;

        // 2. Has user enrolled fingerprint/face?
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);
        if (!enrolled) return;

        // 3. Which type is available?
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

        const typeNames = types.map((type) => {
            switch (type) {
                case LocalAuthentication.AuthenticationType.FINGERPRINT:
                    return 'Fingerprint';
                case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
                    return 'Face ID';
                case LocalAuthentication.AuthenticationType.IRIS:
                    return 'Iris';
                default:
                    return 'Unknown';
            }
        });

        setBiometricType(typeNames.join(', ') || 'Unknown');
    };

    const authenticate = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login to Student App',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false, // allow PIN fallback
            });

            if (result.success) {
                setAuthenticated(true);
                showMessage('Success', 'Authenticated successfully!');
            } else {
                showMessage('Failed', 'Authentication was cancelled or failed.');
            }
        } catch (error) {
            console.log('Biometric error:', error);
            showMessage('Error', 'Biometric authentication failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Biometric Auth</Text>

            <View style={styles.statusCard}>
                <Text style={styles.label}>Hardware</Text>
                <Text style={styles.value}>
                    {hasHardware ? 'Available' : 'Not available'}
                </Text>

                <Text style={styles.label}>Enrolled</Text>
                <Text style={styles.value}>
                    {isEnrolled ? 'Yes' : 'No'}
                </Text>

                <Text style={styles.label}>Type</Text>
                <Text style={styles.value}>{biometricType}</Text>
            </View>

            <Pressable
                style={[styles.button, (!hasHardware || !isEnrolled) && styles.disabled]}
                onPress={authenticate}
                disabled={!hasHardware || !isEnrolled}
            >
                <Text style={styles.buttonText}>
                    {authenticated ? 'Authenticated' : 'Authenticate'}
                </Text>
            </Pressable>

            <Text style={styles.hint}>
                Enroll fingerprint/Face ID in device settings first.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F2F5FA' },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    statusCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        gap: 6,
    },
    label: { fontSize: 12, color: '#666', marginTop: 8 },
    value: { fontSize: 16, fontWeight: '600' },
    button: {
        backgroundColor: '#2563EB',
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
    disabled: { opacity: 0.5 },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
    hint: { color: '#666', fontSize: 12, marginTop: 20, textAlign: 'center' },
});