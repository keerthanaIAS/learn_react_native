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

### JPG To PNG converter:
keerthana@Keerthanas-MacBook-Air frontend % npx --yes sharp-cli -i ./assets/images/logo.jpg -o ./assets/images/logo.png resize 1024 1024

/Users/keerthana/Desktop/learn_react_native/frontend/assets/images/logo.png
keerthana@Keerthanas-MacBook-Air frontend % file ./assets/images/logo.png

./assets/images/logo.png: PNG image data, 1024 x 1024, 8-bit/colorRGB, non-interlaced
keerthana@Keerthanas-MacBook-Air frontend % 

-----

#### Get IP to run the back end code in mobile too:
ipconfig getifaddr en0


------

###### Sentry setup:
keerthana@Mac-634 frontend % npx @sentry/wizard@latest -i reactNative

┌   Sentry React Native Wizard 
│
◇   ────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                 │
│  The Sentry React Native Wizard will help you set up Sentry for your application.                 │
│  Thank you for using Sentry :)                                 │
│                                 │
│  Version: 9.1.0                                 │
│                                 │
│  This wizard sends telemetry data and crash reports to Sentry. This helps us improve the Wizard.  │
│  You can turn this off at any time by running sentry-wizard --disable-telemetry.                  │
│                                 │
├───────────────────────────────────────────────────────────────────────────────────────────────────╯
│
▲  You have uncommitted or untracked files in your repo:
│  
│  - frontend/package-lock.json
│  - frontend/package.json
│  - frontend/src/app/_layout.tsx
│  - frontend/src/app/config/
│  
│  The wizard will create and update files.
│
◇  Do you want to continue anyway?
│  Yes
│
◇  The @sentry/react-native package is already installed. Do you
want to update it to the latest version?
│  Yes
│
◇  Updated @sentry/react-native with NPM.
│
◇  Are you using Sentry SaaS or self-hosted Sentry?
│  Sentry SaaS (sentry.io)
│
◇  Do you already have a Sentry account?
│  No
│
●  If the browser window didn't open automatically, please open the following link to sign into Sentry:
│  
│  https://sentry.io/account/settings/wizard/mzphpvwhpxhpaqx33rday9yptx6x1d3xqjkl1ppju136k5sevi9vf0aszv6ejx5y/?signup=1&project_platform=react-native
│
◇  Login timed out. No worries - it happens to the best of us.
│
└  Please restart the Wizard and log in to complete the setup.
keerthana@Mac-634 frontend % npx @sentry/wizard@latest -i reactNative --saas --org personal-lst --project react-native

┌   Sentry React Native Wizard 
│
◇   ────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                 │
│  The Sentry React Native Wizard will help you set up Sentry for your application.                 │
│  Thank you for using Sentry :)                                 │
│                                 │
│  Version: 9.1.0                                 │
│                                 │
│  This wizard sends telemetry data and crash reports to Sentry. This helps us improve the Wizard.  │
│  You can turn this off at any time by running sentry-wizard --disable-telemetry.                  │
│                                 │
├───────────────────────────────────────────────────────────────────────────────────────────────────╯
│
▲  You have uncommitted or untracked files in your repo:
│  
│  - frontend/package-lock.json
│  - frontend/package.json
│  - frontend/src/app/_layout.tsx
│  - frontend/src/app/config/
│  
│  The wizard will create and update files.
│
◇  Do you want to continue anyway?
│  Yes
│
◇  The @sentry/react-native package is already installed. Do you
want to update it to the latest version?
│  Yes
│
◇  Updated @sentry/react-native with NPM.
│
●  If the browser window didn't open automatically, please open the following link to log into Sentry:
│  
│  https://sentry.io/account/settings/wizard/aafztwvjmsxwgqoudl23aahq01x59fx55sv3tqs6u564m9jz9i4n3sj6xozfav5n/?org_slug=personal-lst&project_slug=react-native&project_platform=react-native
│
◇  Login complete.
│
◇  Selected project personal-lst/react-native
│
◇  Do you want to enable Logs? Structured logs allow you to send,
view and query logs and parameters sent from your applications (See
https://docs.sentry.io/platforms/react-native/logs/)
│  Yes
│
●  Logs will be enabled with default settings. You can send logs using the Sentry.logger APIs.
│
◇  Do you want to enable Session Replay to help debug issues? (See
https://docs.sentry.io/platforms/react-native/session-replay/)
│  Yes
│
●  Session Replay will be enabled with default settings (replaysSessionSampleRate: 0.1, replaysOnErrorSampleRate: 1).
│
│  By default, all text content, images, and webviews will be masked for privacy. You can customize this in your code later.
│
◇  Do you want to enable the User Feedback Widget to collect
feedback from your users? (See
https://docs.sentry.io/platforms/react-native/user-feedback/)
│  Yes
│
●  The User Feedback Widget will be enabled with default settings.You can show the widget by calling Sentry.showFeedbackWidget() in your code.
│
▲  Could not find main App file. Place the following code snippet close to the Apps Root component.
│
◇  Add the following code to your App.js or _layout.tsx file: (This ensures the Sentry SDK is ready to capture errors.)

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://382f841f341f3c09b3ec0267aed3dcfc@o4512456913715200.ingest.us.sentry.io/4512456913911808',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

│
◇  Did you apply the snippet above?
│  Yes, continue!
│
▲  Could not find main App file. Please wrap your App's Root component.
│
◇  Add the following code to your App.js or _layout.tsx file:

import * as Sentry from '@sentry/react-native';

export default Sentry.wrap(App);

│
◇  Did you apply the snippet above?
│  Yes, continue!
│
◆  Added Sentry Expo plugin to app.config.json.
│
◆  Added .env.local to .gitignore.
│
◆  Written .env.local.
│
◆  Created metro.config.js with Sentry configuration.
│
◆  Added auth token to android/sentry.properties for you to test uploading source maps and iOS debug files locally.
│
◆  Added default org and project to android/sentry.properties for you to test uploading source maps and iOS debug files locally.
│
◆  Added default url to android/sentry.properties for you to test uploading source maps and iOS debug files locally.
│
◆  Created android/sentry.properties.
│
▲  DO NOT commit auth token to your repository!
│
◆  Added Sentry RN Gradle Plugin to app/build.gradle.
│
◆  Android app/build.gradle saved.
│
◇  Optionally add a project-scoped MCP server configuration for the
Sentry MCP?
│  No
│
◇  To make sure everything is set up correctly, put the following code snippet into your application.
│  The snippet will create a button that, when tapped, sends a test event to Sentry.
│  
│  After that check your project issues:
│  
│  https://personal-lst.sentry.io/issues/?project=4512456913911808

<Button title='Try!' onPress={ () => { Sentry.captureException(newError('First error')) }}/>

│
◇  Have you successfully sent a test event?
│  Yes
│
└  Everything is set up!

   If you encounter any issues, let us know here: https://github.com/getsentry/sentry-react-native/issues

keerthana@Mac-634 frontend % 