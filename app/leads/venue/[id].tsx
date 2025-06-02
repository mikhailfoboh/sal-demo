import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Star, Clock, Instagram, Menu, ArrowUpRight, ArrowRight, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Mock data for venues
const mockVenues = {
  'v1': {
    id: 'v1',
    name: 'The Local Bar',
    type: 'Bar & Restaurant',
    location: 'Surry Hills, Sydney',
    address: '123 Crown Street, Surry Hills, NSW 2010',
    rating: 4.5,
    reviews: 128,
    isNew: true,
    distance: '0.8km',
    tags: ['bar', 'gastropub'],
    hours: '11:00 AM - 11:00 PM',
    social: {
      instagram: '@thelocalbar',
      followers: '2.5k',
      recentPosts: [
        'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg',
        'https://images.pexels.com/photos/2795026/pexels-photo-2795026.jpeg',
        'https://images.pexels.com/photos/2795030/pexels-photo-2795030.jpeg'
      ]
    },
    menu: {
      source: 'https://thelocalbar.com.au/menu',
      lastScraped: '2025-05-28T02:30:00Z',
      sections: [
        {
          name: 'Cocktails',
          items: [
            {
              name: 'Espresso Martini',
              description: 'Vodka, coffee liqueur, fresh espresso',
              price: '$20',
              ingredients: ['vodka', 'coffee liqueur', 'espresso']
            },
            {
              name: 'Negroni',
              description: 'Gin, Campari, sweet vermouth',
              price: '$18',
              ingredients: ['gin', 'campari', 'vermouth']
            }
          ]
        },
        {
          name: 'Wine',
          items: [
            {
              name: 'House Red',
              description: 'Shiraz blend',
              price: '$12/glass',
              ingredients: ['red wine']
            },
            {
              name: 'Premium White',
              description: 'Chardonnay',
              price: '$14/glass',
              ingredients: ['white wine']
            }
          ]
        }
      ],
      matchedProducts: [
        {
          menuItem: 'House Red',
          suggestions: [
            {
              name: 'Premium Shiraz',
              description: 'Perfect match for their house red',
              confidence: 0.85,
              pricePoint: '$28/bottle',
              margin: '+35%',
              currentCost: '$22/bottle',
              projectedSales: '24 bottles/month'
            }
          ]
        },
        {
          menuItem: 'Premium White',
          suggestions: [
            {
              name: 'Reserve Chardonnay',
              description: 'Ideal replacement for their current white',
              confidence: 0.92,
              pricePoint: '$32/bottle',
              margin: '+40%',
              currentCost: '$24/bottle',
              projectedSales: '20 bottles/month'
            }
          ]
        }
      ],
      basketAnalysis: {
        totalCurrentCost: '$920/month',
        projectedCost: '$1,120/month',
        projectedRevenue: '$2,240/month',
        overallMargin: '+38%',
        monthlySavings: '$280',
        qualityImprovement: 'Premium wine selection',
        sustainabilityScore: 'Medium - Mixed suppliers'
      }
    }
  },
  'v2': {
    id: 'v2',
    name: 'Green Garden Cafe',
    type: 'Vegan Cafe',
    location: 'Newtown, Sydney',
    address: '456 King Street, Newtown, NSW 2042',
    rating: 4.8,
    reviews: 256,
    isNew: false,
    distance: '1.2km',
    tags: ['cafe', 'vegan', 'organic'],
    hours: '7:00 AM - 4:00 PM',
    social: {
      instagram: '@greengardencafe',
      followers: '5k',
      recentPosts: [
        'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg'
      ]
    },
    menu: {
      source: 'https://greengardencafe.com.au/menu',
      lastScraped: '2025-05-28T02:30:00Z',
      sections: [
        {
          name: 'Specialty Coffee',
          items: [
            {
              name: 'Organic Cold Brew',
              description: 'House-made, 24hr steep',
              price: '$6.50',
              ingredients: ['organic coffee beans', 'filtered water']
            },
            {
              name: 'Oat Milk Latte',
              description: 'Premium organic coffee, barista oat milk',
              price: '$5.50',
              ingredients: ['organic coffee', 'oat milk']
            }
          ]
        },
        {
          name: 'Fresh Juices',
          items: [
            {
              name: 'Green Detox',
              description: 'Kale, cucumber, apple, ginger',
              price: '$8.50',
              ingredients: ['kale', 'cucumber', 'apple', 'ginger']
            },
            {
              name: 'Immunity Boost',
              description: 'Orange, carrot, turmeric',
              price: '$8.00',
              ingredients: ['orange', 'carrot', 'turmeric']
            }
          ]
        }
      ],
      matchedProducts: [
        {
          menuItem: 'Organic Cold Brew',
          suggestions: [
            {
              name: 'Premium Organic Coffee Beans',
              description: 'Single-origin, perfect for cold brew',
              confidence: 0.95,
              pricePoint: '$32/kg',
              margin: '+45%',
              currentCost: '$24/kg',
              projectedSales: '10kg/month'
            }
          ]
        },
        {
          menuItem: 'Oat Milk Latte',
          suggestions: [
            {
              name: 'Barista Oat Milk',
              description: 'Premium barista-grade oat milk',
              confidence: 0.92,
              pricePoint: '$3.80/L',
              margin: '+35%',
              currentCost: '$3.20/L',
              projectedSales: '100L/month'
            }
          ]
        },
        {
          menuItem: 'Fresh Juices',
          suggestions: [
            {
              name: 'Organic Produce Package',
              description: 'Weekly delivery of fresh organic produce',
              confidence: 0.88,
              pricePoint: '$280/week',
              margin: '+40%',
              currentCost: '$220/week',
              projectedSales: '4 deliveries/month'
            }
          ]
        }
      ],
      basketAnalysis: {
        totalCurrentCost: '$1,240/month',
        projectedCost: '$1,480/month',
        projectedRevenue: '$2,960/month',
        overallMargin: '+42%',
        monthlySavings: '$320',
        qualityImprovement: 'Premium organic products',
        sustainabilityScore: 'High - 100% organic suppliers'
      }
    }
  }
};

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  
  const venue = mockVenues[id as keyof typeof mockVenues];

  if (!venue) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Venue Not Found" showBackButton />
        <View style={styles.content}>
          <Text>The requested venue could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={venue.name} 
        showBackButton 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.infoCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.venueName}>{venue.name}</Text>
                <Text style={styles.venueType}>{venue.type}</Text>
              </View>
              {venue.isNew && (
                <View style={styles.newTag}>
                  <Text style={styles.newTagText}>New Venue</Text>
                </View>
              )}
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{venue.address}</Text>
              </View>
              <View style={styles.infoItem}>
                <Star size={16} color={colors.warning} />
                <Text style={styles.infoText}>{venue.rating} ({venue.reviews} reviews)</Text>
              </View>
              <View style={styles.infoItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{venue.hours}</Text>
              </View>
              <View style={styles.infoItem}>
                <Instagram size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{venue.social.instagram} • {venue.social.followers}</Text>
              </View>
            </View>

            <View style={styles.socialGrid}>
              {venue.social.recentPosts.map((post, index) => (
                <View key={index} style={styles.socialImage}>
                  <img 
                    src={post}
                    alt={`Recent post ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.menuCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Menu size={20} color={colors.textSecondary} />
                <Text style={styles.cardTitle}>Menu Analysis</Text>
              </View>
              <Text style={styles.lastScraped}>
                Last updated: {new Date(venue.menu.lastScraped).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.menuContent}>
              {venue.menu.sections.map((section, index) => (
                <View key={index} style={styles.menuSection}>
                  <Text style={styles.sectionTitle}>{section.name}</Text>
                  {section.items.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.menuItem}>
                      <View style={styles.menuItemHeader}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                      </View>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      <View style={styles.ingredientTags}>
                        {item.ingredients.map((ingredient, i) => (
                          <View key={i} style={styles.ingredientTag}>
                            <Text style={styles.ingredientText}>{ingredient}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View style={styles.matchedProducts}>
              <Text style={styles.matchedTitle}>Product Matches</Text>
              {venue.menu.matchedProducts.map((match, index) => (
                <View key={index} style={styles.matchCard}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchMenuItem}>{match.menuItem}</Text>
                    <View style={styles.confidenceTag}>
                      <Text style={styles.confidenceText}>
                        {Math.round(match.suggestions[0].confidence * 100)}% Match
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionName}>
                      {match.suggestions[0].name}
                    </Text>
                    <Text style={styles.suggestionDescription}>
                      {match.suggestions[0].description}
                    </Text>
                    
                    <View style={styles.metrics}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Current Cost</Text>
                        <Text style={styles.metricValue}>
                          {match.suggestions[0].currentCost}
                        </Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>New Price</Text>
                        <Text style={styles.metricValue}>
                          {match.suggestions[0].pricePoint}
                        </Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Margin</Text>
                        <Text style={[
                          styles.metricValue,
                          { color: colors.success }
                        ]}>
                          {match.suggestions[0].margin}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.projectionTag}>
                      <TrendingUp size={14} color={colors.info} />
                      <Text style={styles.projectionText}>
                        Projected Sales: {match.suggestions[0].projectedSales}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.basketAnalysis}>
              <Text style={styles.basketTitle}>Total Basket Analysis</Text>
              
              <View style={styles.basketMetrics}>
                <View style={styles.basketMetricRow}>
                  <View style={styles.basketMetricItem}>
                    <Text style={styles.basketMetricLabel}>Current Cost</Text>
                    <Text style={styles.basketMetricValue}>
                      {venue.menu.basketAnalysis.totalCurrentCost}
                    </Text>
                  </View>
                  <ArrowRight size={16} color={colors.textSecondary} />
                  <View style={styles.basketMetricItem}>
                    <Text style={styles.basketMetricLabel}>Projected Cost</Text>
                    <Text style={styles.basketMetricValue}>
                      {venue.menu.basketAnalysis.projectedCost}
                    </Text>
                  </View>
                </View>

                <View style={styles.basketHighlights}>
                  <View style={styles.basketHighlight}>
                    <Text style={styles.highlightLabel}>Overall Margin</Text>
                    <Text style={[styles.highlightValue, { color: colors.success }]}>
                      {venue.menu.basketAnalysis.overallMargin}
                    </Text>
                  </View>
                  <View style={styles.basketHighlight}>
                    <Text style={styles.highlightLabel}>Monthly Savings</Text>
                    <Text style={[styles.highlightValue, { color: colors.success }]}>
                      {venue.menu.basketAnalysis.monthlySavings}
                    </Text>
                  </View>
                </View>

                <View style={styles.basketNotes}>
                  <Text style={styles.basketNote}>
                    Quality: {venue.menu.basketAnalysis.qualityImprovement}
                  </Text>
                  <Text style={styles.basketNote}>
                    Sustainability: {venue.menu.basketAnalysis.sustainabilityScore}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          <View style={styles.actions}>
            <Button
              title="Create Pitch"
              variant="primary"
              onPress={() => router.push(`/leads/pitch/${id}`)}
              style={styles.actionButton}
            />
            <Button
              title="View Menu Source"
              variant="secondary"
              onPress={() => {}}
              style={styles.actionButton}
              rightIcon={<ArrowUpRight size={18} color={colors.primary} />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  venueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 4,
  },
  venueType: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  newTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  newTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#D97706',
  },
  infoGrid: {
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#374151',
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  socialImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  menuCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  lastScraped: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  menuContent: {
    gap: 24,
  },
  menuSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#111827',
  },
  menuItem: {
    gap: 4,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#374151',
  },
  itemPrice: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
  },
  itemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  ingredientTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  ingredientTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ingredientText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#4B5563',
  },
  matchedProducts: {
    marginTop: 24,
    gap: 12,
  },
  matchedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#111827',
    marginBottom: 8,
  },
  matchCard: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchMenuItem: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0C4A6E',
  },
  confidenceTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  confidenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#0369A1',
  },
  suggestionContent: {
    paddingTop: 8,
  },
  suggestionName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0C4A6E',
    marginBottom: 4,
  },
  suggestionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#0C4A6E',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#1E40AF',
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E40AF',
  },
  projectionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  projectionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1E40AF',
  },
  basketAnalysis: {
    marginTop: 24,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  basketTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#111827',
    marginBottom: 16,
  },
  basketMetrics: {
    gap: 16,
  },
  basketMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  basketMetricItem: {
    flex: 1,
  },
  basketMetricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 2,
  },
  basketMetricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  basketHighlights: {
    flexDirection: 'row',
    gap: 16,
  },
  basketHighlight: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
  },
  highlightLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#065F46',
    marginBottom: 2,
  },
  highlightValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#059669',
  },
  basketNotes: {
    gap: 4,
  },
  basketNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#4B5563',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
});