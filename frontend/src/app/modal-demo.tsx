
import { useState } from 'react';

import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
} from 'react-native';

import ScreenBackground from '@/components/ScreenBackground';

export default function ModalDemo() {

  const [visible, setVisible] = useState(false);

  return (
    <ScreenBackground>

      <View style={styles.container}>

        <Text style={styles.heading}>
          Modal Demo
        </Text>

        <Button
          title="Open Modal"
          onPress={() => setVisible(true)}
        />

        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >

          <View style={styles.overlay}>

            <View style={styles.modal}>

              <Text style={styles.title}>
                Welcome!
              </Text>

              <Text style={styles.description}>
                This is a React Native Modal.
              </Text>

              <Button
                title="Close Modal"
                onPress={() => setVisible(false)}
              />

            </View>

          </View>

        </Modal>

      </View>

    </ScreenBackground>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    gap: 20,
  },

  heading: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modal: {
    backgroundColor: 'white',
    width: '100%',
    padding: 25,
    borderRadius: 12,
    gap: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 16,
  },

});
