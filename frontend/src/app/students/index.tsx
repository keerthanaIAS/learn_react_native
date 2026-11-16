
import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';
import ScreenBackground from '@/components/ScreenBackground';

export default function StudentsScreen() {
    const students = [
        { id: 1, name: 'Shiv' },
        { id: 2, name: 'Vikram' },
    ];

    return (
        <ScreenBackground>
            <View style={{ flex: 1, padding: 20 }}>
                <Text style={{ fontSize: 24 }}>
                    Student List
                </Text>

                {students.map((student) => (
                    <Text
                        key={student.id}
                        onPress={() =>
                            router.push(`/students/${student.id}`)
                        }
                    >
                        {student.name}
                    </Text>
                ))}

                <Button
                    title="Add Student"
                    onPress={() => router.push('/students/add')}
                />
            </View>
        </ScreenBackground>
    );
}
