import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ChevronDown, Crosshair } from 'lucide-react-native';
import { GooglePlacesService, GooglePlaceRestaurant, isGooglePlacesConfigured } from '@/services/googlePlaces';
import { WebMapView } from './WebMapView';

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

interface RestaurantMapViewProps {
  onRestaurantPress: (restaurant: Restaurant) => void;
  onRestaurantsLoaded?: (restaurants: Restaurant[]) => void;
  radius: number;
  existingLeads?: SimpleLead[];
  onRadiusChange?: (radius: number) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onAddToLeads?: (restaurant: Restaurant) => Promise<{ id: string } | void>;
  currentRestaurantIndex?: number;
  totalRestaurants?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onNavigateToLead?: (leadId: string) => void;
}

interface DropdownProps {
  title: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, value, options, onSelect, isOpen, onToggle }) => {
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <Text style={styles.dropdownButtonText}>{value}</Text>
        {isOpen ? (
          <ChevronDown size={16} color="#6B7280" style={styles.chevron} />
        ) : (
          <ChevronDown size={16} color="#6B7280" style={styles.chevron} />
        )}
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownOption,
                value === option.value && styles.dropdownOptionSelected
              ]}
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
};

export const RestaurantMapView: React.FC<RestaurantMapViewProps> = ({
  onRestaurantPress,
  onRestaurantsLoaded,
  radius,
  existingLeads,
  onRadiusChange,
  searchQuery,
  onSearchChange,
  onAddToLeads,
  currentRestaurantIndex = 0,
  totalRestaurants = 0,
  onPrevious,
  onNext,
  onNavigateToLead
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedPotential, setSelectedPotential] = useState('Potential');
  const [selectedAvailability, setSelectedAvailability] = useState('Availability');
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);

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
    { label: 'Newly Opened', value: 'New' },
    { label: 'Closed', value: 'Closed' }
  ];

  const formatRadius = (radiusValue: number) => {
    return radiusValue >= 1000 ? `${radiusValue / 1000}km` : `${radiusValue}m`;
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleLocationPress = () => {
    // Close any open dropdowns and dismiss keyboard
    setOpenDropdown(null);
    
    if (location && mapRef) {
      mapRef.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      getLocationPermission();
    }
  }, []);

  useEffect(() => {
    if (location) {
      loadNearbyRestaurants(location.coords.latitude, location.coords.longitude);
    }
  }, [location, radius]);

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required for map view');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadNearbyRestaurants = async (lat: number, lng: number) => {
    setIsLoadingRestaurants(true);
    
    try {
      let restaurantData: GooglePlaceRestaurant[] = [];

      // Try to use Google Places API if configured
      if (isGooglePlacesConfigured()) {
        restaurantData = await GooglePlacesService.searchNearbyRestaurants({
          latitude: lat,
          longitude: lng,
          radius: radius,
        });
      } else {
        // Fall back to mock data if Google Places API is not configured
        console.log('Google Places API not configured, using mock data');
        restaurantData = getMockRestaurants(lat, lng);
      }

      // Convert GooglePlaceRestaurant to Restaurant format
      const convertedRestaurants: Restaurant[] = restaurantData.map(place => ({
        id: place.id,
        name: place.name,
        coordinates: place.coordinates,
        rating: place.rating,
        reviewCount: place.reviewCount,
        cuisineType: place.cuisineType,
        address: place.address,
        isOpen: place.isOpen,
        isNewlyOpened: place.isNewlyOpened,
        priceLevel: place.priceLevel,
      }));

      setRestaurants(convertedRestaurants);
      if (onRestaurantsLoaded) {
        onRestaurantsLoaded(convertedRestaurants);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      // Use mock data as fallback
      const mockRestaurants = getMockRestaurants(lat, lng);
      const convertedMockRestaurants: Restaurant[] = mockRestaurants.map(place => ({
        id: place.id,
        name: place.name,
        coordinates: place.coordinates,
        rating: place.rating,
        reviewCount: place.reviewCount,
        cuisineType: place.cuisineType,
        address: place.address,
        isOpen: place.isOpen,
        isNewlyOpened: place.isNewlyOpened,
        priceLevel: place.priceLevel,
      }));
      
      setRestaurants(convertedMockRestaurants);
      if (onRestaurantsLoaded) {
        onRestaurantsLoaded(convertedMockRestaurants);
      }
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  // Mock data fallback
  const getMockRestaurants = (lat: number, lng: number): GooglePlaceRestaurant[] => {
    return [
      {
        id: '1',
        name: 'Café Verde Oliva',
        coordinates: { latitude: lat + 0.005, longitude: lng + 0.005 },
        rating: 4.5,
        reviewCount: 128,
        cuisineType: 'Italian',
        address: '123 Main Street, Surry Hills NSW 2010',
        isOpen: true,
        isNewlyOpened: false,
        priceLevel: 2
      },
      {
        id: '2',
        name: 'Ocean Blue Restaurant',
        coordinates: { latitude: lat - 0.003, longitude: lng + 0.008 },
        rating: 4.2,
        reviewCount: 85,
        cuisineType: 'Seafood',
        address: '456 Harbor Drive, Sydney NSW 2000',
        isOpen: true,
        isNewlyOpened: false,
        priceLevel: 3
      },
      {
        id: '3',
        name: 'Spice Garden',
        coordinates: { latitude: lat + 0.008, longitude: lng - 0.004 },
        rating: 4.7,
        reviewCount: 203,
        cuisineType: 'Asian',
        address: '789 Crown Street, Darlinghurst NSW 2010',
        isOpen: false,
        isNewlyOpened: false,
        priceLevel: 2
      },
      {
        id: '4',
        name: 'The Local Pub',
        coordinates: { latitude: lat - 0.006, longitude: lng - 0.002 },
        rating: 4.0,
        reviewCount: 156,
        cuisineType: 'Pub Food',
        address: '321 George Street, Sydney NSW 2000',
        isOpen: true,
        isNewlyOpened: false,
        priceLevel: 1
      },
      {
        id: '5',
        name: 'Artisan Coffee House',
        coordinates: { latitude: lat + 0.002, longitude: lng + 0.006 },
        rating: 4.6,
        reviewCount: 94,
        cuisineType: 'Cafe',
        address: '654 King Street, Newtown NSW 2042',
        isOpen: true,
        isNewlyOpened: false,
        priceLevel: 1
      },
      {
        id: '6',
        name: 'Bella Vista Pizzeria',
        coordinates: { latitude: lat + 0.007, longitude: lng + 0.003 },
        rating: 4.3,
        reviewCount: 167,
        cuisineType: 'Italian',
        address: '88 Norton Street, Leichhardt NSW 2040',
        isOpen: true,
        isNewlyOpened: true,
        priceLevel: 2
      },
    ];
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    onRestaurantPress(restaurant);
  };

  const assessPotential = (restaurant: Restaurant) => {
    // Assess potential based on cuisine type and rating
    const cuisinePotential = {
      'Italian': 'High',
      'Seafood': 'High', 
      'Japanese': 'Medium',
      'French': 'High',
      'Asian': 'Medium',
      'Mediterranean': 'High',
      'American': 'Low',
      'Cafe': 'Medium',
      'Pub Food': 'Low',
      'Chinese': 'Medium',
      'Mexican': 'Medium',
      'Steakhouse': 'High',
      'Vegetarian': 'Low',
      'Indian': 'Medium',
      'Modern Australian': 'High'
    };

    const basePotential = cuisinePotential[restaurant.cuisineType as keyof typeof cuisinePotential] || 'Medium';
    
    // Adjust based on rating
    if (restaurant.rating >= 4.5) {
      return basePotential === 'Low' ? 'Medium' : 'High';
    } else if (restaurant.rating < 4.0) {
      return basePotential === 'High' ? 'Medium' : 'Low';
    }
    
    return basePotential;
  };

  // Web platform - use WebMapView
  if (Platform.OS === 'web') {
    return (
      <WebMapView
        onRestaurantPress={onRestaurantPress}
        onRestaurantsLoaded={onRestaurantsLoaded}
        radius={radius}
        existingLeads={existingLeads}
        onRadiusChange={onRadiusChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAddToLeads={onAddToLeads}
        currentRestaurantIndex={currentRestaurantIndex}
        totalRestaurants={totalRestaurants}
        onPrevious={onPrevious}
        onNext={onNext}
        onNavigateToLead={onNavigateToLead}
      />
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        mapType="standard"
        onMapReady={() => console.log('Map is ready')}
        onError={(error) => console.error('Map error:', error)}
        // iOS-specific styling approach
        {...Platform.select({
          ios: {
            showsPointsOfInterest: false,
            showsTraffic: false,
            showsBuildings: false,
            provider: undefined, // Use Apple Maps on iOS for better styling
          },
          android: {
            provider: PROVIDER_GOOGLE, // Use Google Maps on Android
            customMapStyle: [
              {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#f5f5f5"
                  }
                ]
              },
              {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#616161"
                  }
                ]
              },
              {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#f5f5f5"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#bdbdbd"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#eeeeee"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#757575"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#e5e5e5"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#9e9e9e"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#ffffff"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#757575"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#dadada"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#616161"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#9e9e9e"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#e5e5e5"
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#eeeeee"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#c9c9c9"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#9e9e9e"
                  }
                ]
              }
            ]
          }
        })}
        ref={(ref) => {
          setMapRef(ref);
        }}
      >
        {/* Radius circle */}
        <Circle
          center={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          radius={radius}
          strokeColor="rgba(8, 112, 87, 0.5)"
          fillColor="rgba(8, 112, 87, 0.1)"
        />
        
        {/* Restaurant markers */}
        {restaurants
          .filter(restaurant => {
            // Filter out restaurants that are already added as leads
            if (!existingLeads || existingLeads.length === 0) return true;
            return !existingLeads.some(lead => 
              lead.businessName.toLowerCase() === restaurant.name.toLowerCase()
            );
          })
          .filter(restaurant => {
            // Filter by potential
            if (selectedPotential !== 'Potential') {
              const potential = assessPotential(restaurant);
              if (potential !== selectedPotential) return false;
            }
            
            // Filter by availability
            if (selectedAvailability !== 'Availability') {
              if (selectedAvailability === 'Open' && !restaurant.isOpen) return false;
              if (selectedAvailability === 'New' && !restaurant.isNewlyOpened) return false;
              if (selectedAvailability === 'Closed' && restaurant.isOpen) return false;
            }
            
            return true;
          })
          .map((restaurant) => {
            // Determine marker color based on status
            let markerColor = '#9CA3AF'; // Default grey for established
            if (!restaurant.isOpen) {
              markerColor = '#EF4444'; // Red for closed
            } else if (restaurant.isNewlyOpened) {
              markerColor = '#10B981'; // Green for newly opened
            } else {
              markerColor = '#6B7280'; // Grey for established
            }

            return (
              <Marker
                key={restaurant.id}
                coordinate={restaurant.coordinates}
                onPress={() => handleRestaurantPress(restaurant)}
              >
                <View style={[
                  styles.markerContainer,
                  { backgroundColor: markerColor }
                ]}>
                  <View style={styles.marker} />
                </View>
              </Marker>
            );
          })}
      </MapView>

      {/* Map Overlays */}
      <View style={styles.overlayContainer}>
        {/* Search Bar Overlay */}
        <View style={styles.searchOverlay}>
          <TextInput
            style={styles.searchOverlayInput}
            placeholder="Search leads by name or location"
            value={searchQuery || ''}
            onChangeText={onSearchChange}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        {/* Filter Dropdowns */}
        <View style={styles.mapOverlay}>
          <Dropdown
            title="Radius"
            value={formatRadius(radius)}
            options={RADIUS_OPTIONS}
            onSelect={(value) => onRadiusChange?.(parseInt(value))}
            isOpen={openDropdown === 'radius'}
            onToggle={() => handleDropdownToggle('radius')}
          />
          
          <Dropdown
            title="Potential"
            value={selectedPotential}
            options={POTENTIAL_OPTIONS}
            onSelect={setSelectedPotential}
            isOpen={openDropdown === 'potential'}
            onToggle={() => handleDropdownToggle('potential')}
          />
          
          <Dropdown
            title="Status"
            value={selectedAvailability}
            options={AVAILABILITY_OPTIONS}
            onSelect={setSelectedAvailability}
            isOpen={openDropdown === 'availability'}
            onToggle={() => handleDropdownToggle('availability')}
          />
        </View>
      </View>

      {/* Current Location Button */}
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={handleLocationPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel="Center map on current location"
      >
        <Crosshair size={20} color="#0369A1" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    // Enhanced shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  webFallbackText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  webFallbackSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  mapOverlay: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1000,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 32,
  },
  dropdownButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  chevron: {
    marginLeft: 4,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  dropdownOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  dropdownOptionTextSelected: {
    color: '#0369A1',
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
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1001,
  },
  searchOverlayInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
}); 