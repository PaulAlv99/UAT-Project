import React, { useEffect, useState } from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import NavBar from '../components/Navbar';
import { useTheme } from '../ThemeContext';

const GroceryMap = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const regionData: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(regionData);

        if (Platform.OS === 'android') {
          await fetchNearbyGroceries(latitude, longitude);
        }

        setLoading(false);
      } catch (err) {
        Alert.alert('Error', 'Unable to load location.');
        setLoading(false);
      }
    })();
  }, []);

  const fetchNearbyGroceries = async (lat: number, lng: number) => {
    try {
      const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=supermarket&key=${key}`;
      console.log("📡 Request URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("✅ Google Maps API Response:", JSON.stringify(data, null, 2));
      setStores(data.results || []);
    } catch (err) {
      console.error("❌ Error fetching groceries:", err);
      Alert.alert('Error', 'Failed to load nearby stores.');
    }
  };

  if (loading || !region) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading map and location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <MapView style={styles.map} region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You" />
        {1===1 &&
          stores.map((store, idx) => (
            <Marker
              key={idx}
              coordinate={{
                latitude: store.geometry.location.lat,
                longitude: store.geometry.location.lng,
              }}
              title={store.name}
              description={store.vicinity}
            />
          ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '70%', // 🔽 Map takes only 70% of screen height
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroceryMap;
