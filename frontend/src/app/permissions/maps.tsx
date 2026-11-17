
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

export default function MapsDemo() {
  const latitude = 11.9416;
  const longitude = 79.8083;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Puducherry"
          description="Demo location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
