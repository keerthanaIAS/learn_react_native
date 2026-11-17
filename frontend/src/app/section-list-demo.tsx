
import {
  View,
  Text,
  SectionList,
  StyleSheet,
} from 'react-native';

import ScreenBackground from '@/components/ScreenBackground';

const studentSections = [
  {
    title: 'React Native',
    data: ['Shiv', 'Keerthana'],
  },
  {
    title: 'Node.js',
    data: ['Vikram', 'Karnan'],
  },
  {
    title: 'React',
    data: ['Vishnu', 'Suriya'],
  },
];

export default function SectionListDemo() {
  return (
    <ScreenBackground>
      <View style={styles.container}>

        <Text style={styles.heading}>
          Students By Course
        </Text>

        <SectionList
          sections={studentSections}

          keyExtractor={(item, index) =>
            item + index
          }

          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item}
              </Text>
            </View>
          )}

          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {section.title}
              </Text>
            </View>
          )}

          renderSectionFooter={({ section }) => (
            <Text style={styles.footer}>
              Total: {section.data.length} students
            </Text>
          )}

          stickySectionHeadersEnabled
        />

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
  sectionHeader: {
    backgroundColor: '#208AEF',
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginTop: 5,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
  },
  footer: {
    color: 'black',
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
