
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ActivityIndicator,
    Platform,
} from 'react-native';

import { useState } from 'react';
import { router } from 'expo-router';

import ScreenBackground from '@/components/ScreenBackground';
import { addStudent } from '@/services/studentService';

export default function AddStudentScreen() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [course, setCourse] = useState('');

    const [errors, setErrors] = useState({
        name: '',
        age: '',
        course: '',
    });

    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {
            name: '',
            age: '',
            course: '',
        };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!age.trim()) {
            newErrors.age = 'Age is required';
        } else if (
            !/^\d+$/.test(age.trim()) ||
            Number(age) <= 0
        ) {
            newErrors.age = 'Enter a valid positive age';
        }

        if (!course.trim()) {
            newErrors.course = 'Course is required';
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            await addStudent({
                name: name.trim(),
                age: Number(age),
                course: course.trim(),
            });

            if (Platform.OS === 'web') {
                window.alert('Student added successfully!');
                router.back();
            } else {
                Alert.alert(
                    'Success',
                    'Student added successfully!',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }

        } catch (error) {
            console.log('Add Student Error:', error);

            if (Platform.OS === 'web') {
                window.alert('Unable to add student. Please try again.');
            } else {
                Alert.alert('Error', 'Unable to add student. Please try again.');
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenBackground>
            <View style={styles.container}>

                <Text style={styles.heading}>
                    Add New Student
                </Text>

                <TextInput
                    placeholder="Enter name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                {!!errors.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                )}

                <TextInput
                    placeholder="Enter age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    style={styles.input}
                />
                {!!errors.age && (
                    <Text style={styles.error}>{errors.age}</Text>
                )}

                <TextInput
                    placeholder="Enter course"
                    value={course}
                    onChangeText={setCourse}
                    style={styles.input}
                />
                {!!errors.course && (
                    <Text style={styles.error}>{errors.course}</Text>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <Button
                        title="Add Student"
                        onPress={handleSubmit}
                    />
                )}

            </View>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 12,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    error: {
        color: '#ffdddd',
        fontWeight: 'bold',
    },
});
