
import { useState, useMemo } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';

import ScreenBackground from '@/components/ScreenBackground';

type Student = {
  id: number;
  name: string;
  age: number;
  course: string;
};

const allStudents: Student[] = [
  { id: 1, name: 'Shiv', age: 31, course: 'React Native' },
  { id: 2, name: 'Vikram', age: 32, course: 'Node.js' },
  { id: 3, name: 'Vishnu', age: 30, course: 'React' },
  { id: 4, name: 'Arjun', age: 25, course: 'React Native' },
  { id: 5, name: 'Rahul', age: 27, course: 'Node.js' },
  { id: 6, name: 'Karnan', age: 29, course: 'React' },
  { id: 7, name: 'Suriya', age: 26, course: 'React Native' },
  { id: 8, name: 'Sandiya', age: 24, course: 'Node.js' },
  { id: 9, name: 'Sowmiya', age: 28, course: 'React' },
  { id: 10, name: 'Kali', age: 23, course: 'Node.js' },
  { id: 11, name: 'Keerthana', age: 30, course: 'React Native' },
  { id: 12, name: 'Tara', age: 22, course: 'React' },
];

const PAGE_SIZE = 4;

const courses = [
  'All',
  'React Native',
  'Node.js',
  'React',
];

export default function SearchFilterPagination() {

  const [search, setSearch] = useState('');

  const [selectedCourse, setSelectedCourse] =
    useState('All');

  const [page, setPage] = useState(1);

  // STEP 1: Search and Filter
  const filteredStudents = useMemo(() => {

    return allStudents.filter(student => {

      const matchesSearch =
        student.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesCourse =
        selectedCourse === 'All' ||
        student.course === selectedCourse;

      return matchesSearch && matchesCourse;

    });

  }, [search, selectedCourse]);

  // STEP 2: Calculate pagination
  const totalPages = Math.ceil(
    filteredStudents.length / PAGE_SIZE
  );

  // STEP 3: Get current page records
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // STEP 4: Reset page when search or filter changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = (course: string) => {
    setSelectedCourse(course);
    setPage(1);
  };

  return (
    <ScreenBackground>

      <View style={styles.container}>

        <Text style={styles.heading}>
          Student Directory
        </Text>

        {/* SEARCH */}

        <TextInput
          placeholder="Search student by name..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />

        {/* FILTER */}

        <Text style={styles.label}>
          Filter by Course
        </Text>

        <View style={styles.filterContainer}>

          {courses.map(course => (

            <Pressable
              key={course}
              onPress={() => handleFilter(course)}
              style={[
                styles.filterButton,
                selectedCourse === course &&
                  styles.activeFilter,
              ]}
            >

              <Text
                style={[
                  styles.filterText,
                  selectedCourse === course &&
                    styles.activeFilterText,
                ]}
              >
                {course}
              </Text>

            </Pressable>

          ))}

        </View>

        {/* RESULT COUNT */}

        <Text style={styles.resultCount}>
          Total Students: {filteredStudents.length}
        </Text>

        {/* STUDENT LIST */}

        <FlatList
          data={paginatedStudents}
          keyExtractor={item => item.id.toString()}

          renderItem={({ item }) => (

            <View style={styles.card}>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text>Age: {item.age}</Text>

              <Text>Course: {item.course}</Text>

            </View>

          )}

          ListEmptyComponent={
            <Text style={styles.empty}>
              No students found
            </Text>
          }

          showsVerticalScrollIndicator={false}
        />

        {/* PAGINATION */}

        <View style={styles.pagination}>

          <Pressable
            disabled={page <= 1}
            onPress={() => setPage(previous => previous - 1)}
            style={[
              styles.pageButton,
              page <= 1 && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>
              Previous
            </Text>
          </Pressable>

          <Text style={styles.pageText}>
            Page {totalPages === 0 ? 0 : page} of {totalPages}
          </Text>

          <Pressable
            disabled={page >= totalPages}
            onPress={() => setPage(previous => previous + 1)}
            style={[
              styles.pageButton,
              page >= totalPages && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>
              Next
            </Text>
          </Pressable>

        </View>

      </View>

    </ScreenBackground>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    gap: 12,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  searchInput: {
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 8,
    fontSize: 15,
  },

  label: {
    color: 'white',
    fontWeight: 'bold',
  },

  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  filterButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: '#208AEF',
  },

  filterText: {
    color: '#333',
    fontSize: 12,
  },

  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },

  resultCount: {
    color: 'white',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    gap: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  empty: {
    color: 'white',
    textAlign: 'center',
    marginTop: 30,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  pageButton: {
    backgroundColor: '#208AEF',
    padding: 12,
    borderRadius: 8,
  },

  disabledButton: {
    backgroundColor: '#777',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  pageText: {
    color: 'white',
    fontWeight: 'bold',
  },

});
