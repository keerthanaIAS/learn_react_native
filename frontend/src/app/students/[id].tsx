
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>
        Student Details
      </Text>

      <Text>Student ID: {id}</Text>
    </View>
  );
}
