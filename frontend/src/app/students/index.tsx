
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import { Platform, useWindowDimensions } from 'react-native';

import { router } from 'expo-router';
import ScreenBackground from '@/components/ScreenBackground';

import {
    deleteStudent,
    getStudents,
    Student,
} from '../../services/studentService';

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pressable } from 'react-native';


export default function StudentsScreen() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { width } = useWindowDimensions();

    const isDesktop = Platform.OS === 'web' && width > 768;

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getStudents();
            setStudents(data);

        } catch (error) {
            console.log('API Error:', error);
            setError('Unable to fetch students');

        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        const performDelete = async () => {
            try {
                const response = await deleteStudent(id);

                const message = `${name} deleted successfully`;

                // Refresh immediately after successful deletion
                await fetchStudents();

                if (Platform.OS === 'web') {
                    window.alert(message);
                } else {
                    Alert.alert('Success', message);
                }

            } catch (error) {
                console.log('Delete Error:', error);

                if (Platform.OS === 'web') {
                    window.alert('Unable to delete student');
                } else {
                    Alert.alert('Error', 'Unable to delete student');
                }
            }
        };
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(
                `Are you sure you want to delete ${name}?`
            );

            if (confirmed) {
                performDelete();
            }
        } else {
            Alert.alert(
                'Delete Student',
                `Are you sure you want to delete ${name}?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: performDelete,
                    },
                ]
            );
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStudents();
        }, [])
    );

    return (
        <ScreenBackground>
            <View style={styles.container}>

                <Text style={styles.heading}>
                    Student Lists ({students.length})
                </Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    gap: 10,
                }}>
                    <Pressable
                        onPress={fetchStudents}
                        disabled={loading}
                        style={{
                            backgroundColor: '#2196F3',
                            padding: 10,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'medium' }}>
                            REFRESH STUDENTS
                        </Text>
                    </Pressable>
                    <Button
                        title="Add Student"
                        onPress={() => router.push('/students/add')}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <FlatList
                        data={students}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            isDesktop ? (
                                <View style={styles.tableRow}>
                                    <Text style={styles.cell}>{item.name}</Text>
                                    <Text style={styles.cell}>{item.age}</Text>
                                    <Text style={styles.cell}>{item.course}</Text>

                                    <View style={styles.actions}>
                                        <Button
                                            title="Edit"
                                            onPress={() =>
                                                router.push(`/students/edit/${item.id}`)
                                            }
                                        />
                                        <Button
                                            title="View"
                                            onPress={() =>
                                                router.push(`/students/${item.id}`)
                                            }
                                        />
                                        <Button
                                            title="Delete"
                                            onPress={() => handleDelete(Number(item.id), String(item.name))}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.card}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text>Age: {item.age}</Text>
                                    <Text>Course: {item.course}</Text>

                                    <Button
                                        title="Edit Student"
                                        onPress={() =>
                                            router.push(`/students/edit/${item.id}`)
                                        }
                                    />

                                    <Button
                                        title="View Details"
                                        onPress={() =>
                                            router.push(`/students/${item.id}`)
                                        }
                                    />
                                    <Button
                                        title="Delete"
                                        onPress={() => handleDelete(Number(item.id), String(item.name))}
                                    />
                                </View>
                            )
                        )}
                        ListHeaderComponent={
                            isDesktop ? (
                                <View style={styles.tableHeader}>
                                    <Text style={styles.headerCell}>Name</Text>
                                    <Text style={styles.headerCell}>Age</Text>
                                    <Text style={styles.headerCell}>Course</Text>
                                    <Text style={styles.headerCell}>Actions</Text>
                                </View>
                            ) : <></>
                        }
                    />
                )}
            </View>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 12,
        borderRadius: 8,
        gap: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 8,
    },

    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 12,
        marginTop: 8,
        marginBottom: 5,
        borderRadius: 8,
    },

    headerCell: {
        flex: 1,
        fontWeight: 'bold',
    },

    cell: {
        flex: 1,
    },

    actions: {
        flex: 1,
        flexDirection: 'row',
        gap: 5,
    },
});
