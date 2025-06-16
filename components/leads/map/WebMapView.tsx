import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { Loader } from '@googlemaps/js-api-loader';
import { ChevronDown, Crosshair } from 'lucide-react-native';
import Constants from 'expo-constants';

interface Restaurant {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number };
  rating: number;
  reviewCount: number;
  cuisineType: string;
  address: string;
  isOpen: boolean;
  isNewlyOpened: boolean;
  priceLevel: number;
}

interface SimpleLead {
  id: string;
  businessName: string;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  status: 'new' | 'contacted' | 'sampling' | 'won';
  nextAction: string;
  productMatch?: string;
  upcomingEvent?: string;
  localBuzz?: string;
  note?: string;
  reminder?: string;
}

interface WebMapViewProps {
  onRestaurantPress: (restaurant: Restaurant) => void;
  onRestaurantsLoaded?: (restaurants: Restaurant[]) => void;
  radius: number;
  existingLeads?: SimpleLead[];
  onRadiusChange?: (radius: number) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface DropdownProps {
  title: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, value, options, onSelect, isOpen, onToggle }) => (
  <View style={styles.dropdown}>
    <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
      <Text style={styles.dropdownButtonText}>{value}</Text>
      <ChevronDown size={16} color="#6B7280" />
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.dropdownOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.dropdownOption}
            onPress={() => {
              onSelect(option.value);
              onToggle();
            }}
          >
            <Text style={[
              styles.dropdownOptionText,
              value === option.value && styles.dropdownOptionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

export const WebMapView: React.FC<WebMapViewProps> = ({
  onRestaurantPress,
  onRestaurantsLoaded,
  radius,
  existingLeads,
  onRadiusChange,
  searchQuery,
  onSearchChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedPotential, setSelectedPotential] = useState('Potential');
  const [selectedAvailability, setSelectedAvailability] = useState('Availability');
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const RADIUS_OPTIONS = [
    { label: '1km', value: '1000' },
    { label: '2km', value: '2000' },
    { label: '5km', value: '5000' },
    { label: '10km', value: '10000' }
  ];

  const POTENTIAL_OPTIONS = [
    { label: 'Potential', value: 'Potential' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  const AVAILABILITY_OPTIONS = [
    { label: 'Availability', value: 'Availability' },
    { label: 'Open Now', value: 'Open' },
    { label: 'Closed', value: 'Closed' }
  ];

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey || 
                      Constants.manifest?.extra?.googleMapsApiKey ||
                      'AIzaSyC1Xqy0Ib2LGHTQtgBdFURxclWSmZ_3pPQ';
        
        console.log('Google Maps API Key:', apiKey ? 'Found' : 'Not found');
        
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setCurrentLocation(location);
              initMap(location);
            },
            (error) => {
              console.error('Error getting location:', error);
              // Fallback to a default location (London)
              const defaultLocation = { lat: 51.5074, lng: -0.1278 };
              setCurrentLocation(defaultLocation);
              initMap(defaultLocation);
            }
          );
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(`Failed to load Google Maps: ${error.message || 'Unknown error'}`);
        setIsLoadingMap(false);
      }
    };

    const initMap = (location: { lat: number; lng: number }) => {
      if (mapRef.current) {
        const googleMap = new google.maps.Map(mapRef.current, {
          center: location,
          zoom: 14,
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(googleMap);
        setIsLoadingMap(false);
        searchNearbyRestaurants(location, googleMap);
      }
    };

    initializeMap();
  }, []);

  // Search nearby restaurants with fallback data
  const searchNearbyRestaurants = (location: { lat: number; lng: number }, googleMap: google.maps.Map) => {
    try {
      // Try the new Places API first, fallback to PlacesService if needed
      const service = new google.maps.places.PlacesService(googleMap);
      
      const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: radius,
        type: 'restaurant' as google.maps.places.PlaceType
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const restaurantData: Restaurant[] = results.slice(0, 20).map((place, index) => ({
            id: place.place_id || `restaurant-${index}`,
            name: place.name || 'Unknown Restaurant',
            coordinates: {
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0
            },
            rating: place.rating || 0,
            reviewCount: place.user_ratings_total || 0,
            cuisineType: place.types?.[0] || 'restaurant',
            address: place.vicinity || '',
            isOpen: place.opening_hours?.open_now || false,
            isNewlyOpened: false,
            priceLevel: place.price_level || 1
          }));

          setRestaurants(restaurantData);
          onRestaurantsLoaded?.(restaurantData);
          addMarkersToMap(restaurantData, googleMap);
        } else {
          console.warn('Places API failed, using mock data:', status);
          loadMockRestaurants(location, googleMap);
        }
      });
    } catch (error) {
      console.error('Places API error, using mock data:', error);
      loadMockRestaurants(location, googleMap);
    }
  };

  // Add markers to map
  const addMarkersToMap = (restaurants: Restaurant[], googleMap: google.maps.Map) => {
    restaurants.forEach((restaurant) => {
      const marker = new google.maps.Marker({
        position: {
          lat: restaurant.coordinates.latitude,
          lng: restaurant.coordinates.longitude
        },
        map: googleMap,
        title: restaurant.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#10B981" stroke="#ffffff" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24)
        }
      });

      marker.addListener('click', () => {
        onRestaurantPress(restaurant);
      });
    });
  };

  // Mock restaurants fallback when API fails
  const loadMockRestaurants = (location: { lat: number; lng: number }, googleMap: google.maps.Map) => {
    const mockRestaurants: Restaurant[] = [
      {
        id: 'mock-1',
        name: 'The Italian Corner',
        coordinates: { latitude: location.lat + 0.001, longitude: location.lng + 0.001 },
        rating: 4.5,
        reviewCount: 120,
        cuisineType: 'Italian',
        address: 'Near your location',
        isOpen: true,
        isNewlyOpened: false,
        priceLevel: 2
      },
      {
        id: 'mock-2', 
        name: 'Sushi Express',
        coordinates: { latitude: location.lat - 0.001, longitude: location.lng + 0.002 },
        rating: 4.2,
        reviewCount: 85,
        cuisineType: 'Japanese',
        address: 'Near your location',
        isOpen: true,
        isNewlyOpened: true,
        priceLevel: 3
      },
      {
        id: 'mock-3',
        name: 'Local Burger Joint',
        coordinates: { latitude: location.lat + 0.002, longitude: location.lng - 0.001 },
        rating: 4.0,
        reviewCount: 200,
        cuisineType: 'American',
        address: 'Near your location', 
        isOpen: false,
        isNewlyOpened: false,
        priceLevel: 1
      }
    ];

    setRestaurants(mockRestaurants);
    onRestaurantsLoaded?.(mockRestaurants);
    addMarkersToMap(mockRestaurants, googleMap);
  };

  // Update radius
  useEffect(() => {
    if (map && currentLocation) {
      searchNearbyRestaurants(currentLocation, map);
    }
  }, [radius]);

  const centerToLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(location);
        setCurrentLocation(location);
        searchNearbyRestaurants(location, map);
      });
    }
  };

  if (mapError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Map Error</Text>
        <Text style={styles.errorSubtext}>{mapError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Overlay */}
      <View style={styles.searchOverlay}>
        <TextInput
          style={styles.searchOverlayInput}
          placeholder="Search location or restaurant name..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <Dropdown
          title="Radius"
          value={RADIUS_OPTIONS.find(opt => opt.value === radius.toString())?.label || '2km'}
          options={RADIUS_OPTIONS}
          onSelect={(value) => onRadiusChange?.(parseInt(value))}
          isOpen={openDropdown === 'radius'}
          onToggle={() => setOpenDropdown(openDropdown === 'radius' ? null : 'radius')}
        />
        <Dropdown
          title="Potential"
          value={selectedPotential}
          options={POTENTIAL_OPTIONS}
          onSelect={setSelectedPotential}
          isOpen={openDropdown === 'potential'}
          onToggle={() => setOpenDropdown(openDropdown === 'potential' ? null : 'potential')}
        />
        <Dropdown
          title="Availability"
          value={selectedAvailability}
          options={AVAILABILITY_OPTIONS}
          onSelect={setSelectedAvailability}
          isOpen={openDropdown === 'availability'}
          onToggle={() => setOpenDropdown(openDropdown === 'availability' ? null : 'availability')}
        />
      </View>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: '#f5f5f5'
        }} 
      />

      {/* Location Button */}
      <TouchableOpacity style={styles.locationButton} onPress={centerToLocation}>
        <Crosshair size={20} color="#374151" />
      </TouchableOpacity>

      {/* Loading Overlay */}
      {isLoadingMap && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  searchOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchOverlayInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContainer: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 999,
  },
  dropdown: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownButtonText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 8,
  },
  dropdownOptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  dropdownOptionTextSelected: {
    color: '#10B981',
    fontFamily: 'Inter-Medium',
  },
  locationButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});