import { useState } from 'react';
import {
    View, Text, Pressable, StyleSheet, Image,
    Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { File, Paths, Directory } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import api from '../../services/api';
import { uploadImage } from '../../services/fileService';
import { Platform } from 'react-native';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import * as FileSystem from 'expo-file-system/legacy';

export default function FileMegaDemo() {
    const [loading, setLoading] = useState(false);

    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState<string>('0');
    const [compressedSize, setCompressedSize] = useState<string>('0');

    const getFileSize = (uri: string) => {
        try {
            const file = new File(uri);
            return (file.size / (1024 * 1024)).toFixed(2);
        } catch (e) {
            return "0";
        }
    };

    // 1. DOWNLOAD FILE
    const handleDownload = async () => {
        try {
            setLoading(true);
            const downloadUrl = `${api.defaults.baseURL}/download-sample`;

            if (Platform.OS === 'web') {
                // WEB DOWNLOAD
                // Create a hidden link and click it
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                Alert.alert('Success', 'Download started in browser!');
            } else {
                // MOBILE DOWNLOAD
                // 1. Download the file
                const destination = new File(Paths.document, 'downloaded_sample.txt');

                // Check if file exists and delete it first
                if (destination.exists) {
                    destination.delete();
                }

                const downloadedFile = await File.downloadFileAsync(downloadUrl, destination);

                // On Android and iOS, every app is locked in its own private "sandbox" (vault). When you use Paths.document or FileSystem.documentDirectory, it saves the file inside that private vault.
                // The app can read it perfectly.
                // The OS knows it's there.
                // But your phone's "File Manager" or "Downloads" app is blocked from seeing it. This is a security feature so App A can't snoop on files downloaded by App B.

                // That's why we use the Sharing API to trigger the native share sheet, which allows the user to save it to a location they can access (like their Downloads folder).
                // Trigger the native share sheet so the user can save it
                // if (await Sharing.isAvailableAsync()) {
                //     await Sharing.shareAsync(downloadedFile.uri, {
                //         dialogTitle: 'Save your downloaded file',
                //         mimeType: 'text/plain', // Since it's a .txt file
                //     });
                // } else {
                //     Alert.alert('Success', 'File downloaded to app storage, but sharing is unavailable.');
                // }

                // If we use SAF(StorageAccessFramework) - ("Which folder do you want to give this app access to?") we can select the folder where to save the file.
                if (Platform.OS === 'android') {
                    // 1. Ask the user to pick a folder (Downloads)
                    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

                    if (permissions.granted) {
                        // 2. Read the file you downloaded to the private vault
                        const base64Data = await FileSystem.readAsStringAsync(downloadedFile.uri, {
                            encoding: FileSystem.EncodingType.Base64,
                        });

                        // 3. Create a new file in the PUBLIC Downloads folder
                        const publicFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
                            permissions.directoryUri,
                            'student_sample.txt',
                            'text/plain'
                        );

                        // 4. Write the data into the public file
                        await FileSystem.writeAsStringAsync(publicFileUri, base64Data, {
                            encoding: FileSystem.EncodingType.Base64,
                        });

                        Alert.alert('Success', 'File saved to your Downloads folder!');
                    } else {
                        Alert.alert('Permission Denied', 'Cannot save to public storage without permission.');
                    }
                }

                // 2. Read the file to PROVE it worked
                const fileContent = await FileSystemLegacy.readAsStringAsync(downloadedFile.uri);

                // 3. Show the content to the user
                Alert.alert(
                    'Download Success!',
                    `File saved to: ${downloadedFile.uri}\n\nFile content:\n"${fileContent}"`
                );
            }
        } catch (error) {
            console.log('Download Error:', error);
            Alert.alert('Download Failed', 'Check your backend connection.');
        } finally {
            setLoading(false);
        }
    };

    // 2. PICK & COMPRESS IMAGE
    const handlePickAndCompress = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
        });

        if (!result.canceled) {
            const originalUri = result.assets[0].uri;
            setOriginalImage(originalUri);
            setOriginalSize(getFileSize(originalUri));

            setLoading(true);
            const manipResult = await ImageManipulator.manipulateAsync(
                originalUri,
                [{ resize: { width: 800 } }],
                { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
            );

            setCompressedImage(manipResult.uri);
            setCompressedSize(getFileSize(manipResult.uri));
            setLoading(false);
        }
    };

    // 3. UPLOAD FILE
    const handleUpload = async () => {
        if (!compressedImage) return;
        setLoading(true);

        try {
            let formData: FormData | undefined;

            // Prepare FormData only for web
            if (Platform.OS === 'web') {
                formData = new FormData();
                const response = await fetch(compressedImage);
                const blob = await response.blob();
                formData.append('file', blob, 'compressed_image.jpg');
            }

            // Call the updated service
            const data = await uploadImage(compressedImage, formData);

            if (data.success) {
                Alert.alert('Success', data.message);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.log('Upload Error:', error);
            Alert.alert('Upload Failed', 'Check your backend console.');
        } finally {
            setLoading(false);
        }
    };

    // 4. SHARE API (UPDATED for Web)
    const handleShare = async () => {
        if (!compressedImage) return;

        if (Platform.OS === 'web') {
            // Web Share API
            if (navigator.share) {
                try {
                    const response = await fetch(compressedImage);
                    const blob = await response.blob();
                    const file = new globalThis.File([blob], 'image.jpg', { type: 'image/jpeg' });
                    await navigator.share({
                        title: 'Share Image',
                        files: [file],
                    });
                } catch (error) {
                    console.log('Web share failed', error);
                }
            } else {
                Alert.alert('Error', 'Sharing is not supported on this browser.');
            }
            return; // Stop here for web
        }

        // Mobile Share API
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Error', 'Sharing is not available on this device');
            return;
        }

        await Sharing.shareAsync(compressedImage, {
            dialogTitle: 'Share this image',
            mimeType: 'image/jpeg',
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>File Mega Demo</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>1. File Download</Text>
                <Pressable style={styles.button} onPress={handleDownload} disabled={loading}>
                    <Text style={styles.buttonText}>Download from Backend</Text>
                </Pressable>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>2. Image Pick & Compress</Text>
                <Pressable style={styles.button} onPress={handlePickAndCompress} disabled={loading}>
                    <Text style={styles.buttonText}>Pick & Compress Image</Text>
                </Pressable>

                {originalImage && (
                    <View style={styles.imageRow}>
                        <View style={styles.imageBox}>
                            <Text style={styles.label}>Original ({originalSize} MB)</Text>
                            <Image source={{ uri: originalImage }} style={styles.image} />
                        </View>
                        <View style={styles.imageBox}>
                            <Text style={styles.label}>Compressed ({compressedSize} MB)</Text>
                            <Image source={{ uri: compressedImage! }} style={styles.image} />
                        </View>
                    </View>
                )}
            </View>

            {compressedImage && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>3. Upload & Share</Text>
                    <Pressable style={[styles.button, { backgroundColor: '#16A34A' }]} onPress={handleUpload} disabled={loading}>
                        <Text style={styles.buttonText}>Upload to Backend</Text>
                    </Pressable>

                    <Pressable style={[styles.button, { backgroundColor: '#7C3AED', marginTop: 10 }]} onPress={handleShare}>
                        <Text style={styles.buttonText}>Share Image (Native)</Text>
                    </Pressable>
                </View>
            )}

            {loading && <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#F2F5FA', flexGrow: 1 },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 15 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#172554' },
    button: { backgroundColor: '#2563EB', padding: 14, borderRadius: 8 },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    imageRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, gap: 10 },
    imageBox: { flex: 1, alignItems: 'center' },
    label: { fontSize: 12, color: '#666', marginBottom: 4 },
    image: { width: '100%', height: 150, borderRadius: 8, resizeMode: 'cover' },
});