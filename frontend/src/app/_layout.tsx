//  Stack is controlling the screen navigation and the header at the top. Expo Router automatically provides a Back arrow.
import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
} from 'react-native';

function WebHeader() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>Student Management</Text>

      <View style={styles.links}>
        <Pressable onPress={() => router.replace('/')}>
          <Text style={styles.link}>Home</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/students')}>
          <Text style={styles.link}>Students</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <Stack
      screenOptions={{
        header: isWeb
          ? () => <WebHeader />
          : undefined,

        headerStyle: {
          backgroundColor: '#208AEF',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="students/index" options={{ title: 'Students' }} />
      <Stack.Screen name="students/add" options={{ title: 'Add Student' }} />
      <Stack.Screen name="students/[id]" options={{ title: 'Student Details' }} />
      <Stack.Screen name="students/edit/[id]" options={{ title: 'Edit Student' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 65,
    backgroundColor: '#208AEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    gap: 25,
  },
  link: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});