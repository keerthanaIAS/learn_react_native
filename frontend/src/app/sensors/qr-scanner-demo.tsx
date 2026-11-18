import { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function QRScannerDemo() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    // Permission not determined yet
    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // Permission not granted
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Camera Permission Needed</Text>
                <Pressable style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </Pressable>
            </View>
        );
    }

    // Scanner screen
    if (isScanning) {
        return (
            <View style={styles.scannerContainer}>
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr', 'code128', 'upc_e', 'ean13'],
                    }}
                    onBarcodeScanned={({ data }) => {
                        setScanned(data);
                        setIsScanning(false);
                    }}
                />

                {/* Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.scanHint}>Point at a QR code</Text>
                </View>

                <Pressable
                    style={styles.closeButton}
                    onPress={() => setIsScanning(false)}
                >
                    <Text style={styles.buttonText}>✕ Close Scanner</Text>
                </Pressable>
            </View>
        );
    }

    // Result screen
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>QR Scanner</Text>

            {scanned ? (
                <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>Scanned result:</Text>
                    <Text style={styles.resultText}>{scanned}</Text>
                </View>
            ) : (
                <Text style={styles.hint}>No QR code scanned yet</Text>
            )}

            <Pressable
                style={styles.button}
                onPress={() => {
                    setScanned(null);
                    setIsScanning(true);
                }}
            >
                <Text style={styles.buttonText}>📷 Open Scanner</Text>
            </Pressable>

            {scanned && (
                <Pressable
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => setScanned(null)}
                >
                    <Text style={styles.buttonText}>Clear Result</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F2F5FA',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2563EB',
        padding: 16,
        borderRadius: 10,
        marginTop: 15,
    },
    secondaryButton: {
        backgroundColor: '#64748B',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    hint: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    resultCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 10,
    },
    resultLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    resultText: {
        fontSize: 16,
        fontWeight: '600',
    },
    scannerContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: '#2563EB',
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    scanHint: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#DC2626',
        padding: 16,
        borderRadius: 10,
    },
});