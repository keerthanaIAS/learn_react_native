
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';

export default function ScreenBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();

  const isDesktop = Platform.OS === 'web' && width > 768;

  const backgroundSource = isDesktop
    ? require('../../assets/images/webbg.jpg')
    : require('../../assets/images/bg.jpg');

  return (
    <View style={styles.background}>
      <Image
        source={backgroundSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View
        style={[
          styles.container,
          {
            maxWidth: isDesktop ? 1100 : 600,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    minHeight: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
});
