
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function AddStudentScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !age.trim()) {
      alert('Please enter all details');
      return;
    }

    alert(`Student ${name} added!`);
  };

  return (
    <View style={{ padding: 20, gap: 15 }}>
      <Text>Add New Student</Text>

      <TextInput
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 12 }}
      />

      <TextInput
        placeholder="Enter age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 12 }}
      />

      <Button
        title="Submit"
        onPress={handleSubmit}
      />
    </View>
  );
}
