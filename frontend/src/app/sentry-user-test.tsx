import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import * as Sentry from '@sentry/react-native';

export default function SentryUserTest() {

    const crashAsUser = (userId: string) => {
        // 1. Tell Sentry who this is (Simulating a logged-in user)
        Sentry.setUser({ id: userId });

        // 2. Trigger a crash
        Sentry.captureException(
            new Error(`Fatal error caused by ${userId}`)
        );

        Alert.alert(
            'Crash Sent',
            `Sentry captured an error for user: ${userId}. Check your dashboard!`
        );
    };

    // SCENARIO 1: Same Error, Different Users
    const crashSameError = (userId: string) => {
        Sentry.setUser({ id: userId });

        Sentry.withScope((scope) => {
            // Force them into the SAME issue using a shared fingerprint
            scope.setFingerprint(['shared-crash-bug']);

            // Notice: The message is IDENTICAL except for the user ID, 
            // but the fingerprint forces them together.
            Sentry.captureException(new Error(`Server 500: Shared Bug`));
        });

        Alert.alert('Grouped Crash Sent', `User ${userId} triggered the shared bug.`);
    };

    // SCENARIO 2: Different Errors, Different Users
    const crashDifferentError = (userId: string, errorCode: string) => {
        Sentry.setUser({ id: userId });

        Sentry.withScope((scope) => {
            // No fingerprint here. Sentry will group by message.
            // Since the messages are different, they become separate issues.
            Sentry.captureException(
                new Error(`Database error: ${errorCode}`)
            );
        });

        Alert.alert('Unique Crash Sent', `User ${userId} triggered error ${errorCode}.`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sentry Grouping Test</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Same Error (Grouped)</Text>
                <Text style={styles.desc}>All 3 users hit the EXACT SAME bug.</Text>
                <Pressable
                    style={[styles.button, { backgroundColor: '#2563EB' }]}
                    onPress={() => crashSameError('user_001')}
                >
                    <Text style={styles.buttonText}>Shared Bug as User 001</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, { backgroundColor: '#2563EB' }]}
                    onPress={() => crashSameError('user_002')}
                >
                    <Text style={styles.buttonText}>Shared Bug as User 002</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, { backgroundColor: '#2563EB' }]}
                    onPress={() => crashSameError('user_003')}
                >
                    <Text style={styles.buttonText}>Shared Bug as User 003</Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Different Errors (Separate)</Text>
                <Text style={styles.desc}>Each user hits a DIFFERENT bug.</Text>
                <Pressable
                    style={[styles.button, { backgroundColor: '#DC2626' }]}
                    onPress={() => crashDifferentError('user_004', 'DB_TIMEOUT')}
                >
                    <Text style={styles.buttonText}>DB Timeout (User 004)</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, { backgroundColor: '#F59E0B' }]}
                    onPress={() => crashDifferentError('user_005', 'AUTH_FAILED')}
                >
                    <Text style={styles.buttonText}>Auth Failed (User 005)</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, { backgroundColor: '#16A34A' }]}
                    onPress={() => crashDifferentError('user_006', 'FILE_CORRUPT')}
                >
                    <Text style={styles.buttonText}>File Corrupt (User 006)</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F2F5FA', paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    section: { marginBottom: 30, backgroundColor: '#fff', padding: 15, borderRadius: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    desc: { fontSize: 12, color: '#666', marginBottom: 15 },
    button: { padding: 14, borderRadius: 8, marginBottom: 10 },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});