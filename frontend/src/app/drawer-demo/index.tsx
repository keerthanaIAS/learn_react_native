import {
    View,
    Text,
    StyleSheet,
    Pressable,
    useWindowDimensions,
} from "react-native";

import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DrawerHome() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    const isMobile = width < 600;

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Drawer Navigation Demo
            </Text>

            <Text style={styles.description}>
                Welcome to the Drawer Navigation practical.
            </Text>

            <View
                style={[
                    styles.buttonContainer,
                    { flexDirection: isMobile ? "column" : "row" },
                ]}
            >
                <Pressable
                    style={[
                        styles.button,
                        isMobile ? styles.buttonMobile : styles.buttonDesktop,
                    ]}
                    onPress={openDrawer}
                >
                    <Ionicons name="menu" size={22} color="#fff" />
                    <Text style={styles.buttonText}>
                        Open Drawer Menu
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        isMobile ? styles.buttonMobile : styles.buttonDesktop,
                    ]}
                    onPress={() => router.replace("/")}
                >
                    <Ionicons name="home" size={22} color="#fff" />
                    <Text style={styles.buttonText}>
                        Back to Student Management
                    </Text>
                </Pressable>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>
                    React Native Navigation
                </Text>

                <Text style={styles.cardDescription}>
                    Learn how to navigate between screens using
                    a side navigation menu.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F8FAFC",
    },
    heading: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#1E293B",
    },
    description: {
        color: "#64748B",
        marginTop: 10,
    },
    buttonContainer: {
        gap: 12,
        marginTop: 20,
        alignItems: "center",
    },
    button: {
        backgroundColor: "#208AEF",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    buttonMobile: {
        width: "100%",
    },
    buttonDesktop: {
        flex: 1, // Equal width side-by-side on web/tablet (or use paddingHorizontal: 24 for compact buttons)
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        marginTop: 25,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardDescription: {
        color: "#64748B",
        marginTop: 10,
        lineHeight: 22,
    },
});