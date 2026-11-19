import api from './api';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy'; // <-- FIX 1: Import from /legacy

// 1. Download File
export const downloadSampleFile = async (destinationUri: any) => {
    console.log('[fileService] Downloading from /download-sample');
    const response = await fetch(`${api.defaults.baseURL}/download-sample`);
    return response;
};

// 2. Upload File
export const uploadImage = async (uri: string, formDataForWeb?: FormData) => {
    console.log('[fileService] Uploading file...');

    if (Platform.OS === 'web') {
        // WEB: Use standard fetch with FormData
        const response = await fetch(`${api.defaults.baseURL}/upload`, {
            method: 'POST',
            body: formDataForWeb,
        });
        return await response.json();
    } else {
        // MOBILE: Use FileSystem.uploadAsync from legacy module
        const response = await FileSystem.uploadAsync(
            `${api.defaults.baseURL}/upload`,
            uri,
            {
                fieldName: 'file',
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                mimeType: 'image/jpeg',
            }
        );
        console.log('[fileService] Upload response:', response);
        // Parse the stringified body returned by native uploader
        return JSON.parse(response.body);
    }
};