import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';

export default function DeviceStatusDemo() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryState, setBatteryState] = useState<string>('Unknown');
  const [lowPower, setLowPower] = useState<boolean>(false);
  const [networkState, setNetworkState] = useState<Network.NetworkState | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    setLoading(true);
    try {
      // ---- Battery ----
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level); // 0.0 to 1.0

      const state = await Battery.getBatteryStateAsync();
      setBatteryState(stateToString(state));

      const low = await Battery.isLowPowerModeEnabledAsync();
      setLowPower(low);

      // ---- Network ----
      const net = await Network.getNetworkStateAsync();
      setNetworkState(net);
    } catch (error) {
      console.log('Status error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Convert battery state enum to readable string
  const stateToString = (state: Battery.BatteryState): string => {
    switch (state) {
      case Battery.BatteryState.CHARGING: return '⚡ Charging';
      case Battery.BatteryState.FULL: return '🔋 Full';
      case Battery.BatteryState.UNPLUGGED: return '🔌 Unplugged';
      default: return '❓ Unknown';
    }
  };

  // Convert network type enum to readable string
  const networkTypeToString = (type: Network.NetworkStateType): string => {
    switch (type) {
      case Network.NetworkStateType.WIFI: return '📶 WiFi';
      case Network.NetworkStateType.CELLULAR: return '📱 Cellular';
      case Network.NetworkStateType.NONE: return '❌ No connection';
      case Network.NetworkStateType.UNKNOWN: return '❓ Unknown';
      case Network.NetworkStateType.BLUETOOTH: return '🔵 Bluetooth';
      case Network.NetworkStateType.ETHERNET: return '🖥️ Ethernet';
      case Network.NetworkStateType.WIMAX: return '📡 WiMAX';
      case Network.NetworkStateType.VPN: return '🔒 VPN';
      case Network.NetworkStateType.OTHER: return '❔ Other';
      default: return '❓ Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Device Status</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 30 }} />
      ) : (
        <>
          {/* Battery card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔋 Battery</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Level</Text>
              <Text style={styles.value}>
                {batteryLevel !== null
                  ? `${Math.round(batteryLevel * 100)}%`
                  : 'Unknown'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>State</Text>
              <Text style={styles.value}>{batteryState}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Low Power Mode</Text>
              <Text style={styles.value}>{lowPower ? 'On' : 'Off'}</Text>
            </View>

            {/* Visual battery bar */}
            {batteryLevel !== null && (
              <View style={styles.batteryBarBg}>
                <View
                  style={[
                    styles.batteryBarFill,
                    { width: `${batteryLevel * 100}%` },
                    batteryLevel < 0.2 && styles.batteryLow,
                  ]}
                />
              </View>
            )}
          </View>

          {/* Network card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Network</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>
                {networkState?.isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>
                {networkState
                  ? networkTypeToString(networkState.type ?? Network.NetworkStateType.UNKNOWN)
                  : 'Unknown'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Internet Reachable</Text>
              <Text style={styles.value}>
                {networkState?.isInternetReachable ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </>
      )}

      <Pressable style={styles.button} onPress={loadStatus} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Refresh Status'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F2F5FA' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, fontWeight: '600' },
  batteryBarBg: {
    marginTop: 12,
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  batteryBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
  },
  batteryLow: {
    backgroundColor: '#DC2626',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});