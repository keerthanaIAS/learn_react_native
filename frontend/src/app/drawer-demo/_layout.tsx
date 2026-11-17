
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function DrawerLayout() {
    return (
        <Drawer
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#208AEF",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                drawerActiveTintColor: "#208AEF",
                drawerInactiveTintColor: "#555",
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: "600",
                },
                drawerStyle: {
                    backgroundColor: "#fff",
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    drawerLabel: "Home",
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color as string}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="profile"
                options={{
                    title: "My Profile",
                    drawerLabel: "Profile",
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={color as string}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="settings"
                options={{
                    title: "Settings",
                    drawerLabel: "Settings",
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="settings-outline"
                            size={size}
                            color={color as string}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="help"
                options={{
                    title: "Help & Support",
                    drawerLabel: "Help & Support",
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="help-circle-outline"
                            size={size}
                            color={color as string}
                        />
                    ),
                }}
            />
        </Drawer>

    );
}
