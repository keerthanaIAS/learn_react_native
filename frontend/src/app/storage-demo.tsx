
import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenBackground from '@/components/ScreenBackground';

export default function StorageDemo() {

    const [name, setName] = useState('');
    const [storedName, setStoredName] = useState('');

    // Save data
    const saveData = async () => {
        try {
            await AsyncStorage.setItem('username', name);

            Alert.alert('Success', 'Name saved successfully');

            setName('');

        } catch (error) {
            console.log(error);
        }
    };

    // Get data
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('username');

            setStoredName(value || 'No data found');

        } catch (error) {
            console.log(error);
        }
    };

    // Remove data
    const removeData = async () => {
        try {
            await AsyncStorage.removeItem('username');

            setStoredName('');
            Alert.alert('Success', 'Data deleted');

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ScreenBackground>
            <View style={styles.container}>

                <Text style={styles.heading}>
                    AsyncStorage Demo
                </Text>

                <TextInput
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <Button
                    title="Save Name"
                    onPress={saveData}
                />

                <View style={styles.space} />

                <Button
                    title="Get Stored Name"
                    onPress={getData}
                />

                <View style={styles.space} />

                <Button
                    title="Delete Stored Name"
                    onPress={removeData}
                />

                <Text style={styles.result}>
                    Stored Name: {storedName}
                </Text>

            </View>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
        gap: 15,
    },

    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    input: {
        borderWidth: 1,
        borderColor: '#aeaeae',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
    },

    space: {
        height: 5,
    },

    result: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#050404',
        borderWidth: 1,
        borderColor: '#aeaeae',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
});
