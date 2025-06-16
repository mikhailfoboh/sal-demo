import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import { Star, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  cuisineType: string;
  address: string;
  isOpen: boolean;
  isNewlyOpened: boolean;
  priceLevel: number;
}

interface RestaurantBottomSheetProps {
  restaurant: Restaurant;
  onClose: () => void;
  onAddToLeads: (restaurant: Restaurant) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

export const RestaurantBottomSheet: React.FC<RestaurantBottomSheetProps> = ({
  restaurant,
  onClose,
  onAddToLeads,
  onPrevious,
  onNext,
  currentIndex = 0,
  totalCount = 0
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        (translateY as any).setOffset((translateY as any)._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        (translateY as any).flattenOffset();
        
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          // Close the sheet if dragged down significantly
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
          });
        } else {
          // Snap back to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const getPriceLevelText = (level: number) => {
    const levels = ['Budget', 'Affordable', 'Moderate', 'Expensive', 'Very Expensive'];
    return levels[level - 1] || 'Unknown';
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

  const salesPotential = assessPotential(restaurant);

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <Modal
      visible={!!restaurant}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <View style={styles.navigation}>
                <TouchableOpacity 
                  onPress={onPrevious} 
                  style={[styles.navButton, !onPrevious && styles.navButtonDisabled]}
                  disabled={!onPrevious}
                >
                  <ChevronLeft size={20} color={onPrevious ? "#6B7280" : "#D1D5DB"} />
                </TouchableOpacity>
                <Text style={styles.pageInfo}>
                  {currentIndex + 1} of {totalCount}
                </Text>
                <TouchableOpacity 
                  onPress={onNext} 
                  style={[styles.navButton, !onNext && styles.navButtonDisabled]}
                  disabled={!onNext}
                >
                  <ChevronRight size={20} color={onNext ? "#6B7280" : "#D1D5DB"} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.status}>
                <View style={[styles.statusDot, { 
                  backgroundColor: !restaurant.isOpen 
                    ? '#EF4444' 
                    : restaurant.isNewlyOpened 
                      ? '#10B981' 
                      : '#6B7280' 
                }]} />
                <Text style={styles.statusText}>
                  {!restaurant.isOpen 
                    ? 'Closed Today' 
                    : restaurant.isNewlyOpened 
                      ? 'Newly Opened!' 
                      : 'Open now'
                  }
                </Text>
              </View>
              <View style={[styles.potentialBadge, { backgroundColor: getPotentialColor(salesPotential) }]}>
                <Text style={styles.potentialText}>
                  {salesPotential} Potential
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Star size={16} color="#F59E0B" />
              <Text style={styles.detailText}>
                {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText}>{restaurant.address}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailText}>
                {restaurant.cuisineType} • {getPriceLevelText(restaurant.priceLevel)}
              </Text>
            </View>
          </View>

          <View style={styles.leadInfo}>
            <View style={styles.leadInfoHeader}>
              <Text style={styles.leadInfoTitle}>Sales Potential Analysis</Text>
              <View style={[styles.potentialBadgeInline, { backgroundColor: getPotentialColor(salesPotential) }]}>
                <Text style={styles.potentialTextInline}>
                  {salesPotential.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.leadInfoText}>
              {salesPotential === 'High' && 
                `Excellent opportunity! ${restaurant.cuisineType} restaurants typically have high ingredient needs and value quality suppliers. Strong potential for premium product partnerships.`
              }
              {salesPotential === 'Medium' && 
                `Good potential for partnership. ${restaurant.cuisineType} venues often seek reliable suppliers with competitive pricing. Consider presenting our mid-range product line.`
              }
              {salesPotential === 'Low' && 
                `Standard opportunity. While ${restaurant.cuisineType} establishments may have specific needs, focus on value proposition and competitive pricing.`
              }
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.primaryButton} onPress={() => onAddToLeads(restaurant)}>
              <Text style={styles.primaryButtonText}>Add to Leads</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '60%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    paddingRight: 12,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  pageInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  potentialBadge: {
    padding: 4,
    borderRadius: 4,
  },
  potentialText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  details: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
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
    marginBottom: 4,
  },
  leadInfoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
  },
  potentialBadgeInline: {
    padding: 4,
    borderRadius: 4,
  },
  potentialTextInline: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  leadInfoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#0C4A6E',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#087057',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
}); 