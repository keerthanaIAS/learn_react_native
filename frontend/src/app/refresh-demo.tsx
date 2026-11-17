
import { useState } from 'react';

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import ScreenBackground from '@/components/ScreenBackground';

const initialEmployees = [
  { id: '1', name: 'Shiv', role: 'React Native Developer' },
  { id: '2', name: 'Vikram', role: 'Node.js Developer' },
  { id: '3', name: 'Vishnu', role: 'React Developer' },
  { id: '4', name: 'Keerthana', role: 'Frontend Developer' },
];

export default function RefreshDemo() {

  const [employees, setEmployees] = useState(initialEmployees);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      // Simulate API request
      await new Promise(resolve =>
        setTimeout(resolve, 2000)
      );

      // Update the list
      setEmployees([
        ...employees,
        {
          id: Date.now().toString(),
          name: 'Karnan',
          role: 'Mobile Developer',
        },
      ]);

    } catch (error) {
      console.log(error);

    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>

        <Text style={styles.heading}>
          Pull To Refresh Demo
        </Text>

        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.role}>
                {item.role}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="white"
              colors={['#2196F3']}
            />
          }
        />

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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 12,
    borderRadius: 8,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  role: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
