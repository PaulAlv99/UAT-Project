// GroceryMap.tsx
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

const GOOGLE_API = `${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;

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
        await fetchNearbyGroceries(latitude, longitude);
        setLoading(false);
      } catch (err) {
        Alert.alert('Error', 'Unable to load location.');
        setLoading(false);
      }
    })();
  }, []);

  const fetchNearbyGroceries = async (lat: number, lng: number) => {
    try {

      console.log(GOOGLE_API);
      const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
        },
        body: JSON.stringify({
          includedTypes: ['supermarket'],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: 1500.0,
            },
          },
        }),
      });

      const data = await response.json();
      console.log('✅ Nearby places:', JSON.stringify(data, null, 2));
      setStores(data.places || []);
    } catch (err) {
      console.error('❌ Error fetching places:', err);
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
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="You"
        />
        {stores.map((place, idx) => (
          <Marker
            key={idx}
            coordinate={{
              latitude: place.location.latitude,
              longitude: place.location.longitude,
            }}
            title={place.displayName?.text}
            description={place.formattedAddress}
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
    height: '100%',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroceryMap;
