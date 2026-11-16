import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';

import ScreenBackground from '@/components/ScreenBackground';
import { getStudent, updateStudent } from '../../../services/studentService';

export default function EditStudentScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [course, setCourse] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const student = await getStudent(Number(id));

                setName(student.name);
                setAge(String(student.age));
                setCourse(student.course);
            } catch {
                Alert.alert('Error', 'Unable to load student');
            }
        };

        loadStudent();
    }, [id]);

    const handleUpdate = async () => {
        if (!name.trim() || !age.trim() || !course.trim()) {
            Alert.alert('Validation', 'All fields are required');
            return;
        }

        if (!/^\d+$/.test(age) || Number(age) <= 0) {
            Alert.alert('Validation', 'Enter a valid age');
            return;
        }

        try {
            setLoading(true);

            await updateStudent(Number(id), {
                name: name.trim(),
                age: Number(age),
                course: course.trim(),
            });

            Alert.alert('Success', 'Student updated successfully', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch {
            Alert.alert('Error', 'Unable to update student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenBackground>
            <View style={{ flex: 1, gap: 15 }}>
                <Text style={{ fontSize: 24, color: 'white' }}>
                    Edit Student
                </Text>

                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={inputStyle}
                />

                <TextInput
                    placeholder="Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    style={inputStyle}
                />

                <TextInput
                    placeholder="Course"
                    value={course}
                    onChangeText={setCourse}
                    style={inputStyle}
                />

                <Button
                    title={loading ? 'Updating...' : 'Update Student'}
                    onPress={handleUpdate}
                    disabled={loading}
                />
                <Button
                    title="Go Back"
                    onPress={() => router.back()}
                />
            </View>
        </ScreenBackground>
    );
}

const inputStyle = {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
};