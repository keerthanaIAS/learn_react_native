
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Home' }}
      />

      <Stack.Screen
        name="students/index"
        options={{ title: 'Students' }}
      />

      <Stack.Screen
        name="students/add"
        options={{ title: 'Add Student' }}
      />

      <Stack.Screen
        name="students/[id]"
        options={{ title: 'Student Details' }}
      />
    </Stack>
  );
}
