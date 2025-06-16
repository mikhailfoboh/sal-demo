import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LeadCard } from '@/components/leads/LeadCard';
import { RestaurantMapView } from '@/components/leads/map/RestaurantMapView';
import { RestaurantBottomSheet } from '@/components/leads/map/RestaurantBottomSheet';
import { useRestaurantScraper } from '@/hooks/useRestaurantScraper';
import { useLeads, DatabaseLead } from '@/hooks/useLeads';
import { leadStyles } from '@/styles/components/leads';
import { planStyles } from '@/styles/components/plan';
import { List, Map } from 'lucide-react-native';

const FILTER_OPTIONS = ['All', 'New', 'Contacted', 'Sampling', 'Won'];
const RADIUS_OPTIONS = [1000, 2000, 5000, 10000]; // in meters

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

// Convert database lead to simple lead for display
const convertToSimpleLead = (dbLead: DatabaseLead): SimpleLead => {
  // Format next action to be user-friendly
  const formatNextAction = (action: string | undefined): string => {
    if (!action) return 'Contact';
    
    // Convert snake_case or camelCase to proper text
    const formatted = action
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
    
    // Handle specific cases
    switch (action.toLowerCase()) {
      case 'request_sample':
        return 'Request Sample';
      case 'visit_venue':
        return 'Visit Venue';
      case 'follow_up':
        return 'Follow Up';
      case 'send_pitch':
        return 'Send Pitch';
      case 'schedule_meeting':
        return 'Schedule Meeting';
      default:
        return formatted || 'Contact';
    }
  };

  return {
    id: dbLead.id,
    businessName: dbLead.business_name,
    location: dbLead.location,
    category: dbLead.category,
    rating: dbLead.rating,
    reviewCount: dbLead.review_count,
    status: dbLead.status,
    nextAction: formatNextAction(dbLead.next_action),
    productMatch: dbLead.product_match,
    upcomingEvent: dbLead.upcoming_event,
    localBuzz: dbLead.local_buzz,
    note: dbLead.note,
    reminder: dbLead.reminder,
  };
};

export default function LeadsScreen() {
  const router = useRouter();
  const { leads: databaseLeads, addLead, isLoading: leadsLoading, error } = useLeads();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>(Platform.OS === 'web' ? 'list' : 'list');
  const [selectedRadius, setSelectedRadius] = useState(5000); // 5km default
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const { convertRestaurantToLead, isLoading } = useRestaurantScraper();

  // Convert database leads to simple leads for display
  const simpleLeads = databaseLeads.map(convertToSimpleLead);

  const filteredLeads = simpleLeads.filter(lead => {
    if (selectedFilter !== 'All' && lead.status.toLowerCase() !== selectedFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lead.businessName.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleRestaurantPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    // Find the index of this restaurant in the nearby list
    const index = nearbyRestaurants.findIndex(r => r.id === restaurant.id);
    setCurrentRestaurantIndex(index >= 0 ? index : 0);
  };

  const handleRestaurantsLoaded = (restaurants: Restaurant[]) => {
    // Filter out already added leads
    const filtered = restaurants.filter(restaurant => {
      return !simpleLeads.some(lead => 
        lead.businessName.toLowerCase() === restaurant.name.toLowerCase()
      );
    });
    setNearbyRestaurants(filtered);
  };

  const handleAddToLeads = async () => {
    if (!selectedRestaurant) return;

    try {
      // Create a new database lead
      const newLead: Omit<DatabaseLead, 'id' | 'created_at' | 'updated_at'> = {
        business_name: selectedRestaurant.name,
        location: selectedRestaurant.address.split(',')[1]?.trim() || selectedRestaurant.cuisineType,
        address: selectedRestaurant.address,
        category: selectedRestaurant.cuisineType,
        cuisine_type: selectedRestaurant.cuisineType,
        rating: selectedRestaurant.rating,
        review_count: selectedRestaurant.reviewCount,
        status: 'new',
        next_action: 'Visit Venue',
        product_match: '3 from menu',
        upcoming_event: 'Potential for partnership',
        local_buzz: `Rated ${selectedRestaurant.rating} stars with ${selectedRestaurant.reviewCount} reviews`,
        note: `${selectedRestaurant.cuisineType} restaurant with excellent potential for our products.`,
        contact_name: '',
        contact_title: '',
        contact_phone: '',
        contact_email: '',
        is_open: selectedRestaurant.isOpen,
        is_newly_opened: selectedRestaurant.isNewlyOpened,
        price_level: selectedRestaurant.priceLevel,
        latitude: selectedRestaurant.coordinates.latitude,
        longitude: selectedRestaurant.coordinates.longitude,
        sales_potential: selectedRestaurant.rating >= 4.5 ? 'High' : selectedRestaurant.rating >= 4.0 ? 'Medium' : 'Low',
        google_place_id: selectedRestaurant.id, // Store Google Place ID for menu analysis
        menu_analysis_status: 'pending', // Will trigger background analysis
      };

      const addedLead = await addLead(newLead);
      
      // Close the bottom sheet
      setSelectedRestaurant(null);
      
      Alert.alert(
        '✅ Lead Added Successfully!',
        `${selectedRestaurant.name} has been added to your leads! Menu analysis will begin shortly and you'll see real dishes from customer reviews.`,
        [
          {
            text: '+ Add Another',
            style: 'default',
            onPress: () => {
              // Keep the map open for adding more leads
              console.log('Ready to add another lead');
            }
          },
          {
            text: 'View Details',
            style: 'default',
            onPress: () => {
              if (addedLead?.id) {
                router.push(`/leads/${addedLead.id}`);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error adding lead:', error);
      Alert.alert(
        'Error',
        'Failed to add lead. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePreviousRestaurant = () => {
    if (currentRestaurantIndex > 0) {
      const newIndex = currentRestaurantIndex - 1;
      setCurrentRestaurantIndex(newIndex);
      setSelectedRestaurant(nearbyRestaurants[newIndex]);
    }
  };

  const handleNextRestaurant = () => {
    if (currentRestaurantIndex < nearbyRestaurants.length - 1) {
      const newIndex = currentRestaurantIndex + 1;
      setCurrentRestaurantIndex(newIndex);
      setSelectedRestaurant(nearbyRestaurants[newIndex]);
    }
  };

  const formatRadius = (radius: number) => {
    return radius >= 1000 ? `${radius / 1000}km` : `${radius}m`;
  };

  return (
    <SafeAreaView style={leadStyles.container} edges={['top']}>
      {/* Header with green background */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Leads</Text>
        {!leadsLoading && (
          <Text style={styles.headerSubtitle}>{simpleLeads.length} leads</Text>
        )}
      </View>

      {/* Loading State */}
      {leadsLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading leads...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !leadsLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading leads: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* View Mode Toggle - Show on all platforms when not loading */}
      {!leadsLoading && !error && (
        <View style={[leadStyles.viewToggleContainer, { marginTop: 16, marginBottom: 16 }]}>
          <TouchableOpacity
            style={[
              leadStyles.viewToggleButton,
              viewMode === 'list' && leadStyles.viewToggleButtonActive,
            ]}
            onPress={() => setViewMode('list')}
          >
            <List size={20} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[
              leadStyles.viewToggleText,
              viewMode === 'list' && leadStyles.viewToggleTextActive,
            ]}>
              Current
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              leadStyles.viewToggleButton,
              viewMode === 'map' && leadStyles.viewToggleButtonActive,
            ]}
            onPress={() => setViewMode('map')}
          >
            <Map size={20} color={viewMode === 'map' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[
              leadStyles.viewToggleText,
              viewMode === 'map' && leadStyles.viewToggleTextActive,
            ]}>
              Discover
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter tabs - only show in list mode and when not loading */}
      {viewMode === 'list' && !leadsLoading && !error && (
        <View style={[leadStyles.filterContainer, { marginTop: 8 }]}>
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                leadStyles.filterTab,
                selectedFilter === filter && leadStyles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  leadStyles.filterText,
                  selectedFilter === filter && leadStyles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Content based on view mode - only show when not loading and no error */}
      {!leadsLoading && !error && (viewMode === 'list' ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              businessName={lead.businessName}
              location={lead.location}
              category={lead.category}
              rating={lead.rating}
              reviewCount={lead.reviewCount}
              status={lead.status}
              nextAction={lead.nextAction}
              productMatch={lead.productMatch}
              upcomingEvent={lead.upcomingEvent}
              localBuzz={lead.localBuzz}
              note={lead.note}
              reminder={lead.reminder}
              onPress={() => router.push(`/leads/${lead.id}`)}
            />
          ))}
          {filteredLeads.length === 0 && (
            <View style={leadStyles.emptyState}>
              <Text style={leadStyles.emptyStateText}>No leads found</Text>
              <Text style={leadStyles.emptyStateSubtext}>
                {searchQuery ? 'Try adjusting your search terms' : 'Switch to discover view to find nearby restaurants'}
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={leadStyles.mapContainer}>
          <RestaurantMapView
            onRestaurantPress={handleRestaurantPress}
            onRestaurantsLoaded={handleRestaurantsLoaded}
            radius={selectedRadius}
            existingLeads={simpleLeads}
            onRadiusChange={setSelectedRadius}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToLeads={handleAddToLeads}
            currentRestaurantIndex={currentRestaurantIndex}
            totalRestaurants={nearbyRestaurants.length}
            onPrevious={currentRestaurantIndex > 0 ? handlePreviousRestaurant : undefined}
            onNext={currentRestaurantIndex < nearbyRestaurants.length - 1 ? handleNextRestaurant : undefined}
          />
        </View>
      ))}

      {/* Restaurant Bottom Sheet - only on native platforms */}
      {selectedRestaurant && Platform.OS !== 'web' && (
        <RestaurantBottomSheet
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onAddToLeads={handleAddToLeads}
          onPrevious={currentRestaurantIndex > 0 ? handlePreviousRestaurant : undefined}
          onNext={currentRestaurantIndex < nearbyRestaurants.length - 1 ? handleNextRestaurant : undefined}
          currentIndex={currentRestaurantIndex}
          totalCount={nearbyRestaurants.length}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#087057',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#087057',
  },
}); 