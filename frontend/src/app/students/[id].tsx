
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';

import ScreenBackground from '@/components/ScreenBackground';

import {
  getStudent,
  Student,
} from '../../services/studentService';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getStudent(Number(id));
        setStudent(data);

      } catch (error) {
        console.log('Student Details Error:', error);
        setError('Unable to fetch student details');

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  return (
    <ScreenBackground>
      <View style={styles.container}>

        <Text style={styles.heading}>
          Student Details
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : student ? (
          <View style={styles.card}>

            <Text style={styles.name}>
              {student.name}
            </Text>

            <Text style={styles.detail}>
              Student ID: {student.id}
            </Text>

            <Text style={styles.detail}>
              Age: {student.age}
            </Text>

            <Text style={styles.detail}>
              Course: {student.course}
            </Text>

            <Button
              title="Edit Student"
              onPress={() =>
                router.push(`/students/edit/${student.id}`)
              }
            />

            <Button
              title="Go Back"
              onPress={() => router.back()}
            />

          </View>
        ) : (
          <Text>Student not found</Text>
        )}

      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    gap: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: '#ffdddd',
  },
});
