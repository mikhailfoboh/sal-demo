import { StyleSheet, View, ScrollView, Linking, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { LeadHeader } from '@/components/leads/LeadHeader';
import { LeadStage } from '@/components/leads/LeadStage';
import { VenueInfo } from '@/components/customers/VenueInfo';
import { SuggestedActions } from '@/components/customers/SuggestedActions';
import { InterestedProducts } from '@/components/leads/InterestedProducts';
import { LeadNotes } from '@/components/leads/LeadNotes';
import { ContactInfo } from '@/components/shared/ContactInfo';
import { useLeadById } from '@/hooks/useLeads';
import { EmptyState } from '@/components/ui/EmptyState';
import { Star, MapPin, Clock, ChevronDown } from 'lucide-react-native';

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { lead, isLoading } = useLeadById(id);
  
  if (isLoading || !lead) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Lead Details" showBackButton />
        <EmptyState
          icon="alert"
          title="Loading..."
          message="Please wait while we fetch the lead details."
        />
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${lead.contact.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${lead.contact.email}`);
  };

  const handleActionPress = (action: any) => {
    // Handle action press based on type
    console.log('Action pressed:', action);
  };

  const handleViewAllNotes = () => {
    router.push(`/notes?leadId=${id}` as any);
  };

  const handleMoveStage = () => {
    // Handle moving to next stage
    console.log('Move to next stage');
  };

  const handleCreateCustomer = () => {
    // Handle creating customer from lead
    console.log('Create customer from lead');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={lead.name} showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.summaryCard}>
            <LeadHeader
              name={lead.name}
              venue={lead.venue}
              stage={lead.stage}
              lastInteraction={lead.lastInteraction}
            />
            
            <LeadStage
              stage={lead.stage}
              onMoveStage={handleMoveStage}
            />
          </Card>
          
          <VenueInfo
            venueType={lead.venueType}
            address={lead.address}
          />
          
          <SuggestedActions
            actions={lead.suggestedActions}
            onActionPress={handleActionPress}
          />
          
          <InterestedProducts
            products={lead.interestedSkus}
          />
          
          <LeadNotes
            notes={lead.notes.slice(0, 3)}
            onNotePress={(noteId) => router.push(`/notes/${noteId}`)}
            onViewAll={handleViewAllNotes}
          />
          
          <ContactInfo
            contact={{
              name: lead.contact.name,
              title: lead.contact.title,
              phone: lead.contact.phone,
              email: lead.contact.email
            }}
          />

          {/* Venue Info Card */}
          <Card style={styles.venueCard}>
            <View style={styles.venueHeader}>
              <Text style={styles.venueName}>{lead.name}</Text>
              {lead.isNew && (
                <View style={styles.newTag}>
                  <Text style={styles.newTagText}>New</Text>
                </View>
              )}
            </View>
            
            <View style={styles.venueDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{lead.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Restaurant</Text>
                <Text style={styles.detailValue}>{lead.category}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Best Time</Text>
                <Text style={styles.detailValue}>{lead.bestTime}</Text>
              </View>
            </View>

            {/* Recent Review */}
            {lead.recentReview && (
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewSource}>G</Text>
                  <Text style={styles.reviewDate}>{lead.recentReview.date}</Text>
                  <View style={styles.reviewRating}>
                    <Text style={styles.ratingText}>{lead.recentReview.rating} Stars</Text>
                    <Text style={styles.reviewCountText}>| {lead.recentReview.reviewCount} reviews</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>"{lead.recentReview.text}"</Text>
              </View>
            )}
          </Card>

          {/* Menu Analysis */}
          {lead.menuAnalysis && (
            <View style={styles.menuSection}>
              <Text style={styles.menuTitle}>{lead.menuAnalysis.title}</Text>
              <Text style={styles.menuSubtitle}>{lead.menuAnalysis.subtitle}</Text>
              
              {lead.menuAnalysis.topItems.map((item) => (
                <Card key={item.id} style={styles.menuItemCard}>
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>{item.price}</Text>
                  </View>
                  
                  <Text style={styles.productMatchLabel}>Product match</Text>
                  {item.productMatches.map((match, index) => (
                    <Text key={index} style={styles.productMatchText}>
                      {match.name}
                    </Text>
                  ))}
                  
                  <View style={styles.pitchAngleSection}>
                    <Text style={styles.pitchAngleLabel}>Pitch Angle:</Text>
                    <Text style={styles.pitchAngleText}>{item.pitchAngle}</Text>
                  </View>

                  <View style={styles.productMatchesSection}>
                    <Text style={styles.productMatchesTitle}>Product Matches ({item.matches.length})</Text>
                    
                    {item.matches.map((match) => (
                      <View key={match.id} style={styles.matchItem}>
                        <View style={styles.matchHeader}>
                          <View style={styles.matchBadge}>
                            <Text style={styles.matchPercentage}>{match.matchPercentage}% Match</Text>
                          </View>
                          <TouchableOpacity style={styles.expandButton}>
                            <Text style={styles.matchName}>{match.name}</Text>
                            <ChevronDown size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                        
                        <View style={styles.priceGrid}>
                          <View style={styles.priceColumn}>
                            <Text style={styles.priceLabel}>Default Price</Text>
                            <Text style={styles.priceValue}>{match.defaultPrice}</Text>
                          </View>
                          <View style={styles.priceColumn}>
                            <Text style={styles.priceLabel}>Retail Price</Text>
                            <Text style={styles.priceValue}>{match.retailPrice}</Text>
                          </View>
                          <View style={styles.priceColumn}>
                            <Text style={styles.priceLabel}>Your Price (10%)</Text>
                            <Text style={styles.priceValue}>{match.yourPrice}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.marginRow}>
                          <Text style={styles.marginLabel}>Avg. Margin</Text>
                          <Text style={styles.marginValue}>{match.avgMargin}</Text>
                        </View>
                      </View>
                    ))}

                    <View style={styles.basketTotal}>
                      <Text style={styles.basketTotalTitle}>Basket Total ({item.matches.length} Products)</Text>
                      <View style={styles.basketSummary}>
                        <View style={styles.basketItem}>
                          <Text style={styles.basketLabel}>Sale price</Text>
                          <Text style={styles.basketValue}>{item.basketTotal.salePrice}</Text>
                        </View>
                        <View style={styles.basketItem}>
                          <Text style={styles.basketLabel}>Profit</Text>
                          <Text style={styles.basketValue}>{item.basketTotal.profit}</Text>
                        </View>
                        <View style={styles.basketItem}>
                          <Text style={styles.basketLabel}>Avg. Margin</Text>
                          <Text style={styles.basketValue}>{item.basketTotal.avgMargin}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
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
    paddingBottom: 32,
  },
  summaryCard: {
    marginBottom: 16,
  },
  venueCard: {
    marginBottom: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  venueName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  newTag: {
    backgroundColor: '#C6E1D5',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  newTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#09352A',
  },
  venueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  reviewSection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewSource: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4285F4',
    marginRight: 8,
  },
  reviewDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginRight: 8,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  reviewCountText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    fontStyle: 'italic',
  },
  menuSection: {
    marginTop: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  menuItemCard: {
    marginBottom: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  menuItemPrice: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  productMatchLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#5E5E5E',
    marginBottom: 4,
  },
  productMatchText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginBottom: 12,
  },
  pitchAngleSection: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  pitchAngleLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0369A1',
    marginBottom: 4,
  },
  pitchAngleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0C4A6E',
    lineHeight: 20,
  },
  productMatchesSection: {
    marginTop: 8,
  },
  productMatchesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  matchItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchBadge: {
    backgroundColor: '#C6E1D5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  matchPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#09352A',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  matchName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    flex: 1,
  },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceColumn: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  marginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  marginValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  basketTotal: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  basketTotalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  basketSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  basketItem: {
    flex: 1,
  },
  basketLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  basketValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
});