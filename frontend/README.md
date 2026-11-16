# POC 1: Student Management App

Technology:

- Frontend: React Native (Expo)
- Backend: Node.js + Express
- Concepts: Components, Props, useState, TextInput, Buttons, FlatList, Styling and Flexbox.

## 1. What we are going to build

Farhaan Shaikh - Mobile app and web developer

Features:

- Display student details.
- Add a new student.
- Update student information.
- Delete a student.
- Display student data dynamically.
- Connect React Native with a simple Node.js backend.

For now, the frontend will use local state for student operations. We'll connect the backend in a later step so you can understand each concept separately.

## 2. Project structure

Create a folder named `StudentManagementPOC`:

text

```text
StudentManagementPOC/
│
├── backend/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── App.js
    ├── app.json
    ├── package.json
    └── assets/
```

## 3. Frontend – React Native

Create the Expo project:

bash

```bash
npx create-expo-app@latest frontend
cd frontend
npx expo start
```

Replace the contents of `App.js` with the following code.

### App.js

jsx

```jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native';

// Child component using Props
function StudentCard({ student }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{student.name}</Text>
      <Text>Age: {student.age}</Text>
      <Text>Course: {student.course}</Text>
    </View>
  );
}

// Main functional component
export default function App() {

  // State management
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');

  const [students, setStudents] = useState([
    { id: '1', name: 'Arun', age: '21', course: 'React Native' },
    { id: '2', name: 'Kumar', age: '22', course: 'Node.js' },
    { id: '3', name: 'Priya', age: '20', course: 'JavaScript' }
  ]);

  // Button interaction and dynamic data
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
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>
        Student Management App
      </Text>

      <Image
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png'
        }}
        style={styles.image}
      />

      <Text style={styles.subheading}>
        Add Student Details
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter student name"
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

      <Button
        title="Add Student"
        onPress={addStudent}
      />

      <Text style={styles.subheading}>
        Student List ({students.length})
      </Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <StudentCard student={item} />
        )}
      />

    </ScrollView>
  );
}

// React Native Styling and Flexbox
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  image: {
    width: 60,
    height: 60,
    alignSelf: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
```

## 4. Backend – Node.js

We will prepare a simple Node.js server. It will not be connected to the frontend yet.

Inside the `backend` folder, run:

bash

```bash
npm init -y
npm install express
```

Create `server.js`:

javascript

```javascript

const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Student Management Backend Running');
});

app.get('/students', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Arun',
      age: 21,
      course: 'React Native'
    },
    {
      id: 2,
      name: 'Kumar',
      age: 22,
      course: 'Node.js'
    }
  ]);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Run the backend:

bash

```bash
node server.js
```

Open `http://localhost:3000` in your browser to check the server message.

## 5. Concepts covered in this POC

| What you learned | Where used |
| --- | --- |
| Functional Components | App, StudentCard |
| Props | StudentCard |
| useState | Student details and list |
| View | Layout |
| Text | Display information |
| Image | Logo |
| TextInput | Student form |
| Button | Add Student |
| ScrollView | Screen scrolling |
| FlatList | Student listing |
| Dynamic Data | Adding students |
| Flexbox | Layout styling |
| StyleSheet | CSS-like styling |
| Expo | Running application |

## 6. Expo configuration revision

You should also remember these files:

- `App.js` – Main application component.
- `index.js` – Application entry point.
- `app.json` – Expo application configuration, name, icon, splash screen, etc.
- `package.json` – Project dependencies, scripts and package information.
- `node_modules` – Installed project dependencies.

Useful commands:

bash

```bash
npx expo start
npx expo start -c
npm install
npm list
node server.js
```

----

