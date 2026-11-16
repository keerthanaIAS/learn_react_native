
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ScreenBackground from '@/components/ScreenBackground';

export default function HomeScreen() {
  return (
    <ScreenBackground>
      <Text style={styles.heading}>
        Student Management
      </Text>

      <View style={styles.actions}>
        <Button
          title="View Students"
          onPress={() => router.push('/students')}
        />

        <Button
          title="Add Student"
          onPress={() => router.push('/students/add')}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  actions: {
    gap: 15,
  },
});
