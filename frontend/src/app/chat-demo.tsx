
import { useState } from 'react';

import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import ScreenBackground from '@/components/ScreenBackground';

type Message = {
    id: number;
    text: string;
    sender: string;
    time: string;
};

// Generate sample chat messages
const allMessages: Message[] = Array.from(
    { length: 100 },
    (_, index) => ({
        id: index + 1,
        text: `This is chat message ${index + 1}`,
        sender: index % 2 === 0 ? 'You' : 'Vikram',
        time: `10:${String(index % 60).padStart(2, '0')} AM`,
    })
);

const PAGE_SIZE = 10;

export default function ChatDemo() {

    const [messages, setMessages] = useState(
        allMessages.slice(0, PAGE_SIZE)
    );

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const [hasMore, setHasMore] = useState(true);

    // Load older messages
    const loadMoreMessages = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            await new Promise(resolve =>
                setTimeout(resolve, 1500)
            );

            const startIndex = page * PAGE_SIZE;

            const newMessages = allMessages.slice(
                startIndex,
                startIndex + PAGE_SIZE
            );

            if (newMessages.length === 0) {
                setHasMore(false);
                return;
            }

            setMessages(previous => [
                ...previous,
                ...newMessages,
            ]);

            setPage(previous => previous + 1);

            if (startIndex + PAGE_SIZE >= allMessages.length) {
                setHasMore(false);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenBackground>
            <View style={styles.container}>

                <Text style={styles.heading}>
                    Chat with Vikram
                </Text>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}

                    inverted

                    onEndReached={loadMoreMessages}
                    onEndReachedThreshold={0.5}

                    ListFooterComponent={
                        loading ? (
                            <ActivityIndicator
                                size="large"
                                color="white"
                            />
                        ) : <></>
                    }

                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.message,
                                item.sender === 'You'
                                    ? styles.myMessage
                                    : styles.otherMessage,
                            ]}
                        >
                            <Text style={styles.sender}>
                                {item.sender}
                            </Text>

                            <Text style={styles.messageText}>
                                {item.text}
                            </Text>

                            <Text style={styles.time}>
                                {item.time}
                            </Text>
                        </View>
                    )}
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

    message: {
        padding: 12,
        marginVertical: 5,
        borderRadius: 12,
        maxWidth: '80%',
    },

    myMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },

    otherMessage: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },

    sender: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#208AEF',
    },

    messageText: {
        fontSize: 16,
        marginVertical: 5,
    },

    time: {
        fontSize: 10,
        color: '#666',
        textAlign: 'right',
    },

});
