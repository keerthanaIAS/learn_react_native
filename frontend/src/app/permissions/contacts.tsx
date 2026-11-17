
import { useState } from "react";

import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

import * as Contacts from "expo-contacts";

type ContactItem = {
  id: string;
  name: string;
  phoneNumbers?: Contacts.PhoneNumber[];
};

export default function ContactsDemo() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [search, setSearch] = useState("");

  const loadContacts = async () => {
    try {
      const permission =
        await Contacts.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Denied",
          "Contacts permission is required."
        );
        return;
      }

      const result = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
        ],
        sort: Contacts.SortTypes.FirstName,
      });

      setContacts(
        result.data.map((contact) => ({
          id: contact.id || contact.name,
          name: contact.name,
          phoneNumbers: contact.phoneNumbers,
        }))
      );

      Alert.alert(
        "Success",
        `${result.data.length} contacts loaded`
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to load contacts.");
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Contacts</Text>

      <Pressable style={styles.button} onPress={loadContacts}>
        <Text style={styles.buttonText}>Load Contacts</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Search contacts..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>

            {item.phoneNumbers?.length ? (
              item.phoneNumbers.map((phone, index) => (
                <Text key={index} style={styles.phone}>
                  {phone.number || "No number"}
                </Text>
              ))
            ) : (
              <Text style={styles.phone}>No phone number</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No contacts found. Load your contacts first.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phone: {
    marginTop: 5,
    color: "#555",
  },
  empty: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});
