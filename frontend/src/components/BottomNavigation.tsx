
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';

import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
    {
        title: 'Home',
        path: '/',
        icon: 'home-outline',
        activeIcon: 'home',
    },
    {
        title: 'Students',
        path: '/students',
        icon: 'people-outline',
        activeIcon: 'people',
    },
    {
        title: 'Device Features',
        path: '/permissions',
        icon: 'cog-outline',
        activeIcon: 'cog',
    },
    {
        title: "Drawer Demo",
        path: "/drawer-demo",
        icon: "menu-outline",
        activeIcon: "menu",
    }
] as const;

export default function BottomNavigation() {

    const pathname = usePathname();

    return (
        <View style={styles.container}>

            {tabs.map((tab) => {

                const active =
                    pathname === tab.path ||
                    (tab.path === '/students' &&
                        pathname.startsWith('/students'));

                return (
                    <Pressable
                        key={tab.path}
                        style={styles.tab}
                        onPress={() => router.replace(tab.path)}
                    >

                        <Ionicons
                            name={active ? tab.activeIcon : tab.icon}
                            size={24}
                            color={active ? '#208AEF' : '#888'}
                        />

                        <Text
                            style={[
                                styles.label,
                                active && styles.activeLabel,
                            ]}
                        >
                            {tab.title}
                        </Text>

                    </Pressable>
                );
            })}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 65,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },

    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: 10,
    },

    label: {
        color: '#888',
        fontSize: 12,
    },

    activeLabel: {
        color: '#208AEF',
        fontWeight: 'bold',
    },

});
