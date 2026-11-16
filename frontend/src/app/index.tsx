
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import { useWindowDimensions } from 'react-native';

function StudentCard({ student }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{student.name}</Text>
      <Text>Age: {student.age}</Text>
      <Text>Course: {student.course}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const { width } = useWindowDimensions();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const isWeb = isReady && Platform.OS === 'web';
  const isDesktop = isWeb && width > 768;

  const backgroundSource = isDesktop
    ? require('../../assets/images/webbg.jpg')
    : require('../../assets/images/bg.jpg');


  const [students, setStudents] = useState([
    { id: '1', name: 'Shiv', age: '31', course: 'React Native' },
    { id: '2', name: 'Vikram', age: '32', course: 'Node.js' },
    { id: '3', name: 'Vishnu', age: '30', course: 'JavaScript' }
  ]);

  const addStudent = () => {
    if (!name.trim() || !age.trim() || !course.trim()) {
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      name,
      age,
      course
    };

    setStudents([...students, newStudent]);

    setName('');
    setAge('');
    setCourse('');
  };


  return (
    <View style={styles.background}>

      {/* Background Image */}
      <Image
        source={backgroundSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Student Management Content */}
      <View style={[
        styles.container,
        { maxWidth: isWeb ? 1100 : 600 }
      ]}
      >
        <Text style={styles.heading}>Student Management</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter course"
          value={course}
          onChangeText={setCourse}
        />

        <Button title="Add Student" onPress={addStudent} />

        <Text style={styles.subheading}>
          Student List ({students.length})
        </Text>

        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentCard student={item} />
          )}
        />
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fffdfd',
    marginBottom: 20
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#090909',
    marginVertical: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
