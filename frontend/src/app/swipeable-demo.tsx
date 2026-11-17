import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import ScreenBackground from '@/components/ScreenBackground';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const initialStudents = [
  { id: 1, name: 'Shiv', course: 'React Native' },
  { id: 2, name: 'Vikram', course: 'Node.js' },
  { id: 3, name: 'Vishnu', course: 'React' },
  { id: 4, name: 'Jai', course: 'JavaScript' },
  { id: 5, name: 'Karnan', course: 'Python' },
  { id: 6, name: 'Dev', course: 'Java' },
];

export default function SwipeableDemo() {
  const [students, setStudents] = useState(initialStudents);

  const handleDelete = (id: number) => {
    setStudents(previous =>
      previous.filter(student => student.id !== id)
    );
  };

  const renderRightActions = (id: number) => {
    return (
      <Pressable
        style={styles.actions}
        onPress={() => handleDelete(id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Swipeable Students</Text>

        {students.map(student => (
          <ReanimatedSwipeable
            key={student.id}
            friction={2}
            rightThreshold={40}
            containerStyle={styles.swipeableRow}
            renderRightActions={() => renderRightActions(student.id)}
          >
            <View style={styles.card}>
              <Text style={styles.name}>{student.name}</Text>
              <Text style={styles.course}>{student.course}</Text>
              <Text style={styles.hint}>Swipe left to delete</Text>
            </View>
          </ReanimatedSwipeable>
        ))}
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  swipeableRow: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  course: {
    fontSize: 15,
    marginTop: 5,
  },
  hint: {
    color: '#010101',
    marginTop: 8,
    fontSize: 12,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 8,
    width: 100,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});