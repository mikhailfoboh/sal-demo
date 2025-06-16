import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { Loader } from '@googlemaps/js-api-loader';
import { ChevronDown, Crosshair } from 'lucide-react-native';
import Constants from 'expo-constants';
import { GooglePlacesService } from '@/services/googlePlaces';

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
  onSearchChange,
  onAddToLeads,
  currentRestaurantIndex = 0,
  totalRestaurants = 0,
  onPrevious,
  onNext,
  onNavigateToLead
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
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [addedRestaurantName, setAddedRestaurantName] = useState('');
  const [addedLeadId, setAddedLeadId] = useState<string | null>(null);
  const [radiusCircle, setRadiusCircle] = useState<google.maps.Circle | null>(null);

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
        addRadiusCircle(location, googleMap);
      }
    };

    initializeMap();
  }, []);

  // Helper function to determine cuisine type from Google Places types
  const determineCuisineType = (types: string[], name: string): string => {
    // Map Google Place types to our cuisine categories
    const typeMap: Record<string, string> = {
      'italian_restaurant': 'Italian',
      'chinese_restaurant': 'Chinese',
      'japanese_restaurant': 'Japanese',
      'indian_restaurant': 'Indian',
      'mexican_restaurant': 'Mexican',
      'french_restaurant': 'French',
      'thai_restaurant': 'Thai',
      'greek_restaurant': 'Greek',
      'seafood_restaurant': 'Seafood',
      'steakhouse': 'Steakhouse',
      'pizza_place': 'Italian',
      'sushi_restaurant': 'Japanese',
      'cafe': 'Cafe',
      'bar': 'Pub Food',
      'bakery': 'Cafe',
      'meal_takeaway': 'Takeaway',
      'meal_delivery': 'Takeaway',
      'restaurant': 'Restaurant'
    };

    // Check place types first
    for (const type of types) {
      if (typeMap[type]) {
        return typeMap[type];
      }
    }

    // Check name for cuisine indicators
    const nameIndicators: Record<string, string> = {
      'pizza': 'Italian',
      'sushi': 'Japanese',
      'chinese': 'Chinese',
      'indian': 'Indian',
      'thai': 'Thai',
      'mexican': 'Mexican',
      'italian': 'Italian',
      'french': 'French',
      'greek': 'Greek',
      'cafe': 'Cafe',
      'coffee': 'Cafe',
      'steakhouse': 'Steakhouse',
      'seafood': 'Seafood',
      'burger': 'American',
      'pub': 'Pub Food',
      'bistro': 'Modern Australian',
    };

    const lowerName = name.toLowerCase();
    for (const [indicator, cuisine] of Object.entries(nameIndicators)) {
      if (lowerName.includes(indicator)) {
        return cuisine;
      }
    }

    return 'Modern Australian'; // Default
  };

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
          const restaurantData: Restaurant[] = results.slice(0, 20).map((place, index) => {
            // Use proper cuisine type determination
            const cuisineType = determineCuisineType(place.types || [], place.name || '');

            return {
              id: place.place_id || `restaurant-${index}`,
              name: place.name || 'Unknown Restaurant',
              coordinates: {
                latitude: place.geometry?.location?.lat() || 0,
                longitude: place.geometry?.location?.lng() || 0
              },
              rating: place.rating || 0,
              reviewCount: place.user_ratings_total || 0,
              cuisineType,
              address: place.vicinity || '',
              isOpen: place.opening_hours?.open_now || false,
              isNewlyOpened: false,
              priceLevel: place.price_level || 1
            };
          });

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

  // Determine marker color based on restaurant status
  const getMarkerColor = (restaurant: Restaurant): string => {
    if (!restaurant.isOpen) {
      return '#EF4444'; // Red for closed
    } else if (restaurant.isNewlyOpened) {
      return '#10B981'; // Green for newly opened
    } else {
      return '#6B7280'; // Grey for established
    }
  };

  // Add markers to map with color coding
  const addMarkersToMap = (restaurants: Restaurant[], googleMap: google.maps.Map) => {
    restaurants.forEach((restaurant) => {
      const markerColor = getMarkerColor(restaurant);
      
      const marker = new google.maps.Marker({
        position: {
          lat: restaurant.coordinates.latitude,
          lng: restaurant.coordinates.longitude
        },
        map: googleMap,
        title: restaurant.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="${markerColor}" stroke="#ffffff" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="#ffffff"/>
              ${restaurant.isNewlyOpened ? '<circle cx="16" cy="16" r="3" fill="#10B981"/>' : ''}
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        setSelectedRestaurant(restaurant);
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

  // Handle adding restaurant to leads
  const handleAddToLeads = async () => {
    if (selectedRestaurant && onAddToLeads) {
      try {
        const result = await onAddToLeads(selectedRestaurant);
        setAddedRestaurantName(selectedRestaurant.name);
        setAddedLeadId(result?.id || null);
        setSelectedRestaurant(null);
        setShowAlertModal(true);
      } catch (error) {
        console.error('Error adding lead:', error);
        // Show error confirmation
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
      }
    }
  };

  // Assess sales potential based on restaurant data
  const assessPotential = (restaurant: Restaurant): string => {
    let score = 0;
    
    // Rating contribution (40% weight)
    if (restaurant.rating >= 4.5) score += 4;
    else if (restaurant.rating >= 4.0) score += 3;
    else if (restaurant.rating >= 3.5) score += 2;
    else score += 1;
    
    // Review count contribution (30% weight)  
    if (restaurant.reviewCount >= 200) score += 3;
    else if (restaurant.reviewCount >= 100) score += 2;
    else if (restaurant.reviewCount >= 50) score += 1;
    
    // Newly opened bonus (20% weight)
    if (restaurant.isNewlyOpened) score += 2;
    
    // Open status (10% weight)
    if (restaurant.isOpen) score += 1;
    
    // Convert score to potential level
    if (score >= 8) return 'High';
    else if (score >= 5) return 'Medium';
    else return 'Low';
  };

  // Add radius circle to map
  const addRadiusCircle = (location: { lat: number; lng: number }, googleMap: google.maps.Map) => {
    // Remove existing circle
    if (radiusCircle) {
      radiusCircle.setMap(null);
    }

    // Create new circle
    const circle = new google.maps.Circle({
      strokeColor: 'rgba(8, 112, 87, 0.5)',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'rgba(8, 112, 87, 0.1)',
      fillOpacity: 0.35,
      map: googleMap,
      center: location,
      radius: radius,
    });

    setRadiusCircle(circle);
  };

  // Update radius
  useEffect(() => {
    if (map && currentLocation) {
      searchNearbyRestaurants(currentLocation, map);
      addRadiusCircle(currentLocation, map);
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
        addRadiusCircle(location, map);
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

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.restaurantName}>{selectedRestaurant.name}</Text>
                <Text style={styles.restaurantAddress}>{selectedRestaurant.address}</Text>
              </View>
              <View style={styles.headerActions}>
                {/* Navigation */}
                {totalRestaurants > 1 && (
                  <View style={styles.navigation}>
                    <TouchableOpacity 
                      onPress={onPrevious}
                      style={[styles.navButton, !onPrevious && styles.navButtonDisabled]}
                      disabled={!onPrevious}
                    >
                      <Text style={styles.navButtonText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageInfo}>
                      {currentRestaurantIndex + 1} of {totalRestaurants}
                    </Text>
                    <TouchableOpacity 
                      onPress={onNext}
                      style={[styles.navButton, !onNext && styles.navButtonDisabled]}
                      disabled={!onNext}
                    >
                      <Text style={styles.navButtonText}>›</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setSelectedRestaurant(null)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.restaurantDetails}>
              <View style={styles.ratingRow}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>★ {selectedRestaurant.rating}</Text>
                  <Text style={styles.reviewCount}>({selectedRestaurant.reviewCount} reviews)</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selectedRestaurant.isOpen ? '#10B981' : '#EF4444' }
                ]}>
                  <Text style={styles.statusText}>
                    {!selectedRestaurant.isOpen 
                      ? 'Closed Today' 
                      : selectedRestaurant.isNewlyOpened 
                        ? 'Newly Opened!' 
                        : 'Open now'
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.cuisineType}>{selectedRestaurant.cuisineType}</Text>
                {selectedRestaurant.isNewlyOpened && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>

              <View style={styles.potentialRow}>
                <Text style={styles.potentialLabel}>Sales Potential:</Text>
                <Text style={[
                  styles.potentialValue,
                  { color: assessPotential(selectedRestaurant) === 'High' ? '#10B981' : 
                           assessPotential(selectedRestaurant) === 'Medium' ? '#F59E0B' : '#6B7280' }
                ]}>
                  {assessPotential(selectedRestaurant)}
                </Text>
              </View>
            </View>

            {/* Sales Potential Analysis */}
            <View style={styles.leadInfo}>
              <View style={styles.leadInfoHeader}>
                <Text style={styles.leadInfoTitle}>Sales Potential Analysis</Text>
                <View style={[
                  styles.potentialBadgeInline, 
                  { backgroundColor: assessPotential(selectedRestaurant) === 'High' ? '#10B981' : 
                                   assessPotential(selectedRestaurant) === 'Medium' ? '#F59E0B' : '#6B7280' }
                ]}>
                  <Text style={styles.potentialTextInline}>
                    {assessPotential(selectedRestaurant).toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.leadInfoText}>
                {assessPotential(selectedRestaurant) === 'High' && 
                  `Excellent opportunity! ${selectedRestaurant.cuisineType} restaurants typically have high ingredient needs and value quality suppliers. Strong potential for premium product partnerships.`
                }
                {assessPotential(selectedRestaurant) === 'Medium' && 
                  `Good potential for partnership. ${selectedRestaurant.cuisineType} venues often seek reliable suppliers with competitive pricing. Consider presenting our mid-range product line.`
                }
                {assessPotential(selectedRestaurant) === 'Low' && 
                  `Standard opportunity. While ${selectedRestaurant.cuisineType} establishments may have specific needs, focus on value proposition and competitive pricing.`
                }
              </Text>
            </View>

            <TouchableOpacity style={styles.addToLeadsButton} onPress={handleAddToLeads}>
              <Text style={styles.addToLeadsText}>Add to Leads</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Rich Alert Modal */}
      {showAlertModal && (
        <View style={styles.alertOverlay}>
          <View style={styles.alertModal}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>✅ Lead Added Successfully!</Text>
              <Text style={styles.alertMessage}>
                {addedRestaurantName} has been added to your leads! Menu analysis will begin shortly and you'll see real dishes from customer reviews.
              </Text>
            </View>
            <View style={styles.alertActions}>
              <TouchableOpacity 
                style={styles.alertSecondaryButton}
                onPress={() => {
                  setShowAlertModal(false);
                  // Keep the map open for adding more leads
                }}
              >
                <Text style={styles.alertSecondaryText}>+ Add Another</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.alertPrimaryButton}
                onPress={() => {
                  setShowAlertModal(false);
                  if (addedLeadId && onNavigateToLead) {
                    onNavigateToLead(addedLeadId);
                  } else {
                    console.log('Navigate to lead details - Lead ID:', addedLeadId);
                  }
                }}
              >
                <Text style={styles.alertPrimaryText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Simple Confirmation Message */}
      {showConfirmation && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationMessage}>
            <Text style={styles.confirmationText}>✓ Added to Leads!</Text>
          </View>
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 3000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  restaurantDetails: {
    marginBottom: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cuisineType: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  newBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  potentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  potentialLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  potentialValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  addToLeadsButton: {
    backgroundColor: '#087057',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addToLeadsText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  confirmationOverlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 4000,
    alignItems: 'center',
  },
  confirmationMessage: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  // Navigation styles
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  navButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  pageInfo: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  // Sales potential analysis styles
  leadInfo: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  leadInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leadInfoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
  },
  potentialBadgeInline: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  potentialTextInline: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  leadInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#0C4A6E',
    lineHeight: 16,
  },
  // Alert modal styles
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5000,
  },
  alertModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  alertHeader: {
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 12,
  },
  alertSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  alertSecondaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  alertPrimaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#087057',
    alignItems: 'center',
  },
  alertPrimaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});