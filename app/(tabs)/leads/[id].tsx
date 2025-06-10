import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Linking, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { LeadStage } from '@/components/leads/LeadStage';
import { ContactInfo } from '@/components/shared/ContactInfo';
import { ProductSelector } from '@/components/leads/ProductSelector';
import { Segmented } from '@/components/ui/Segmented';
import { PostVisitTab } from '@/components/leads/PostVisitTab';
import { useLeadById, useLeads, PostVisitChecklistItem, PostVisitNote, PostVisitAction } from '@/hooks/useLeads';
import { EmptyState } from '@/components/ui/EmptyState';
import { Star, MapPin, Clock, ChevronDown } from 'lucide-react-native';

type ProductOption = {
  id: string;
  name: string;
  matchPercentage: number;
  defaultPrice: string;
  retailPrice: string;
  yourPrice: string;
  avgMargin: string;
};

type ProductMatch = {
  name: string;
};

type MenuSourceLink = {
  url: string;
  label: string;
  platform: string;
};

type MenuItemMatch = {
  id: string;
  name: string;
  matchPercentage: number;
  defaultPrice: string;
  retailPrice: string;
  yourPrice: string;
  avgMargin: string;
  alternatives?: ProductOption[];
};

type MenuItem = {
  id: string;
  name: string;
  price: string;
  category?: string;
  description?: string;
  productMatches?: ProductMatch[];
  menuSourceLink?: MenuSourceLink;
  pitchAngle: string;
  matches?: MenuItemMatch[];
};

type MenuAnalysis = {
  title: string;
  subtitle: string;
  topItems?: MenuItem[];
  isProcessing?: boolean;
  isFailed?: boolean;
  isPending?: boolean;
};

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { lead, isLoading } = useLeadById(id);
  const { updateLead } = useLeads();
  
  // Reference: PRD/POST_VISIT_PRD.md - Story 1.1: Tabbed Interface Implementation
  const [activeTab, setActiveTab] = useState('lead-info');
  
  // Debug logging - cleaned up
  console.log('Lead Details - Active Tab:', activeTab);
  console.log('Lead Details - Lead Stage:', lead?.stage);
  
  // Component update tracking
  useEffect(() => {
    console.log('Lead Details - Component updated');
  }, [lead, activeTab]);
  
  // State to track selected products for each match
  const [selectedProducts, setSelectedProducts] = useState<Record<string, ProductOption>>({});
  
  // Initialize selected products when lead data loads
  useEffect(() => {
    if (lead?.menuAnalysis?.topItems) {
      const initialSelections: Record<string, ProductOption> = {};
      lead.menuAnalysis.topItems.forEach((item: MenuItem) => {
        if (item.matches) {
          item.matches.forEach((match: MenuItemMatch) => {
            initialSelections[match.id] = {
              id: match.id,
              name: match.name,
              matchPercentage: match.matchPercentage,
              defaultPrice: match.defaultPrice,
              retailPrice: match.retailPrice,
              yourPrice: match.yourPrice,
              avgMargin: match.avgMargin,
            };
          });
        }
      });
      setSelectedProducts(initialSelections);
    }
  }, [lead]);
  
  // Reference: PRD/POST_VISIT_PRD.md - Epic 5: Data Persistence & Integration
  const handlePostVisitDataUpdate = async (data: {
    checklist?: PostVisitChecklistItem[];
    notes?: PostVisitNote[];
    actions?: PostVisitAction[];
  }) => {
    try {
      const updates: any = {
        post_visit_last_updated: new Date().toISOString(),
      };
      
      if (data.checklist) {
        updates.post_visit_checklist = data.checklist;
      }
      if (data.notes) {
        updates.post_visit_notes = data.notes;
      }
      if (data.actions) {
        updates.post_visit_actions = data.actions;
      }
      
      await updateLead(id, updates);
    } catch (error) {
      console.error('Error updating post-visit data:', error);
    }
  };
  
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

  const handleMoveStage = () => {
    // Handle moving to next stage
    console.log('Move to next stage');
  };

  const handleProductChange = (matchId: string, newProduct: ProductOption) => {
    setSelectedProducts(prev => ({
      ...prev,
      [matchId]: newProduct
    }));
  };

  const calculateBasketTotal = (matches: MenuItemMatch[]) => {
    let totalSalePrice = 0;
    let totalProfit = 0;
    
    matches.forEach((match: MenuItemMatch) => {
      const selectedProduct = selectedProducts[match.id];
      if (selectedProduct) {
        const salePrice = parseFloat(selectedProduct.yourPrice.replace('$', ''));
        const defaultPrice = parseFloat(selectedProduct.defaultPrice.replace('$', ''));
        totalSalePrice += salePrice;
        totalProfit += (salePrice - defaultPrice);
      }
    });
    
    const avgMargin = totalSalePrice > 0 ? (totalProfit / totalSalePrice) * 100 : 0;
    
    return {
      salePrice: `$${totalSalePrice.toFixed(2)}`,
      profit: `$${totalProfit.toFixed(2)}`,
      avgMargin: `${avgMargin.toFixed(1)}%`
    };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lead.name}</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Reference: PRD/POST_VISIT_PRD.md - Story 1.1: Tabbed Interface Implementation */}
      <View style={styles.tabContainer}>
        <Segmented
          options={[
            { label: 'Lead Info', value: 'lead-info' },
            { label: 'Post Visit Checklist', value: 'post-visit' },
          ]}
          value={activeTab}
          onChange={(newTab) => {
            console.log('📱 Tab changed to:', newTab);
            setActiveTab(newTab);
          }}
          containerStyle={styles.segmentedContainer}
        />
      </View>

      {/* Lead Info Tab - Reference: PRD/POST_VISIT_PRD.md - Story 1.2: Lead Info Tab */}
      {activeTab === 'lead-info' && (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Venue Name and Badge - Outside Card */}
            <View style={styles.venueHeader}>
              <Text style={styles.venueName}>{lead.name}</Text>
              {lead.isNew && (
                <View style={styles.newTag}>
                  <Text style={styles.newTagText}>New</Text>
                </View>
              )}
            </View>

            {/* Venue Details in Individual Boxes */}
            <View style={styles.venueDetailsContainer}>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{lead.location}</Text>
                <Text style={styles.detailLabel}>Location</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{lead.category}</Text>
                <Text style={styles.detailLabel}>Restaurant</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{lead.bestTime}</Text>
                <Text style={styles.detailLabel}>Best Time</Text>
              </View>
            </View>

            {/* Lead Stage and Review Card */}
            <Card style={styles.venueCard}>
              {/* Lead Stage Section */}
              <LeadStage
                stage={lead.stage}
                onMoveStage={handleMoveStage}
              />

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
                
                {/* Source Verification Section */}
                {lead.menuAnalysis.sourceVerification && (
                  <View style={styles.sourceVerificationSection}>
                    <Text style={styles.sourceVerificationTitle}>Data Source & Verification</Text>
                    <Text style={styles.sourceVerificationSource}>
                      Source: {lead.menuAnalysis.sourceVerification.dataSource}
                    </Text>
                    {lead.menuAnalysis.sourceVerification.scrapedAt && (
                      <Text style={styles.sourceVerificationDate}>
                        Scraped: {new Date(lead.menuAnalysis.sourceVerification.scrapedAt).toLocaleDateString()}
                      </Text>
                    )}
                    
                    <Text style={styles.sourceVerificationDisclaimer}>
                      ⚠️ {lead.menuAnalysis.sourceVerification.disclaimer}
                    </Text>
                    
                    <View style={styles.verificationLinksContainer}>
                      {lead.menuAnalysis.sourceVerification.verificationLinks?.map((link: any, index: number) => (
                        <TouchableOpacity 
                          key={index}
                          style={styles.verificationLinkButton}
                          onPress={async () => {
                            try {
                              if (link.url) {
                                console.log('Opening verification URL:', link.url);
                                const canOpen = await Linking.canOpenURL(link.url);
                                if (canOpen) {
                                  await Linking.openURL(link.url);
                                } else {
                                  console.log('Cannot open URL:', link.url);
                                }
                              }
                            } catch (error) {
                              console.error('Error opening verification link:', error);
                            }
                          }}
                        >
                          <Text style={styles.verificationLinkText}>{link.label}</Text>
                          <Text style={styles.verificationLinkDescription}>{link.description}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                
                {/* Show loading state for processing */}
                {lead.menuAnalysis.isProcessing && (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.loadingText}>AI is researching the menu online...</Text>
                    <Text style={styles.loadingSubtext}>This usually takes 2-3 minutes</Text>
                  </View>
                )}
                
                {/* Show error state for failed analysis */}
                {lead.menuAnalysis.isFailed && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>❌ Menu analysis failed</Text>
                    <Text style={styles.errorSubtext}>We couldn't analyze the menu automatically. Contact support for manual analysis.</Text>
                  </View>
                )}
                
                {/* Show pending state with example data */}
                {lead.menuAnalysis.isPending && (
                  <View style={styles.pendingContainer}>
                    <Text style={styles.pendingText}>⏳ Menu analysis starting...</Text>
                    <Text style={styles.pendingSubtext}>Showing example data while AI researches the actual menu</Text>
                  </View>
                )}
                
                {/* Show actual menu items */}
                {lead.menuAnalysis.topItems && lead.menuAnalysis.topItems.length > 0 && lead.menuAnalysis.topItems.map((item: MenuItem) => {
                  const basketTotal = item.matches ? calculateBasketTotal(item.matches) : { salePrice: '$0.00', profit: '$0.00', avgMargin: '0%' };
                  
                  return (
                    <Card key={item.id} style={styles.menuItemCard}>
                      {/* Enhanced Menu Item Header */}
                      <View style={styles.enhancedMenuItemHeader}>
                        <View style={styles.menuItemTitleSection}>
                          <Text style={styles.enhancedMenuItemName}>{item.name}</Text>
                          {item.category && <Text style={styles.menuItemCategory}>{item.category}</Text>}
                        </View>
                        <View style={styles.priceSection}>
                          <Text style={styles.enhancedMenuItemPrice}>{item.price}</Text>
                          {item.description && (
                            <Text style={styles.menuItemDescription}>{item.description}</Text>
                          )}
                        </View>
                      </View>
                      
                      <Text style={styles.productMatchLabel}>Product match</Text>
                      {item.productMatches && item.productMatches.map((match: ProductMatch, index: number) => (
                        <Text key={index} style={styles.productMatchText}>
                          {match.name}
                        </Text>
                      ))}
                      
                      {/* Menu Source Link */}
                      {item.menuSourceLink && (
                        <View style={styles.menuSourceContainer}>
                          <Text style={styles.menuSourceLabel}>Menu Source:</Text>
                          <TouchableOpacity 
                            style={styles.menuSourceLink}
                            onPress={async () => {
                              try {
                                const url = item.menuSourceLink!.url;
                                console.log('🔗 Opening menu source:', url);
                                
                                const canOpen = await Linking.canOpenURL(url);
                                if (canOpen) {
                                  await Linking.openURL(url);
                                } else {
                                  console.log('❌ Cannot open URL:', url);
                                  // Try opening in default browser as fallback
                                  await Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(item.name + ' menu')}`);
                                }
                              } catch (error) {
                                console.error('❌ Error opening menu source:', error);
                                // Fallback to Google search
                                try {
                                  await Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(item.name + ' menu')}`);
                                } catch (fallbackError) {
                                  console.error('❌ Fallback also failed:', fallbackError);
                                }
                              }
                            }}
                          >
                            <Text style={styles.menuSourceText}>
                              {item.menuSourceLink.label} ({item.menuSourceLink.platform})
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      
                      <View style={styles.pitchAngleSection}>
                        <Text style={styles.pitchAngleLabel}>Pitch Angle:</Text>
                        <Text style={styles.pitchAngleText}>{item.pitchAngle}</Text>
                      </View>

                      {item.matches && item.matches.length > 0 && (
                        <View style={styles.productMatchesSection}>
                          <Text style={styles.productMatchesTitle}>Product Matches ({item.matches.length})</Text>
                          
                          {item.matches.map((match: MenuItemMatch) => {
                            const selectedProduct = selectedProducts[match.id];
                            // Create a complete list of all possible products for this match
                            const allPossibleProducts = [
                              {
                                id: match.id,
                                name: match.name,
                                matchPercentage: match.matchPercentage,
                                defaultPrice: match.defaultPrice,
                                retailPrice: match.retailPrice,
                                yourPrice: match.yourPrice,
                                avgMargin: match.avgMargin,
                              },
                              ...(match.alternatives || [])
                            ];
                            
                            // Filter out the currently selected product from alternatives
                            const alternatives = allPossibleProducts.filter(product => 
                              product.id !== (selectedProduct?.id || match.id)
                            );
                            
                            return (
                              <View key={match.id} style={styles.matchItem}>
                                <ProductSelector
                                  selectedProduct={selectedProduct || {
                                    id: match.id,
                                    name: match.name,
                                    matchPercentage: match.matchPercentage,
                                    defaultPrice: match.defaultPrice,
                                    retailPrice: match.retailPrice,
                                    yourPrice: match.yourPrice,
                                    avgMargin: match.avgMargin,
                                  }}
                                  alternatives={alternatives}
                                  onProductChange={(product) => handleProductChange(match.id, product)}
                                />
                                
                                {selectedProduct && (
                                  <>
                                    <View style={styles.priceGrid}>
                                      <View style={styles.priceColumn}>
                                        <Text style={styles.priceLabel}>Default Price</Text>
                                        <Text style={styles.priceValue}>{selectedProduct.defaultPrice}</Text>
                                      </View>
                                      <View style={styles.priceColumn}>
                                        <Text style={styles.priceLabel}>Retail Price</Text>
                                        <Text style={styles.priceValue}>{selectedProduct.retailPrice}</Text>
                                      </View>
                                      <View style={styles.priceColumn}>
                                        <Text style={styles.priceLabel}>Your Price (10%)</Text>
                                        <Text style={styles.priceValue}>{selectedProduct.yourPrice}</Text>
                                      </View>
                                      <View style={styles.priceColumn}>
                                        <Text style={styles.priceLabel}>Avg. Margin</Text>
                                        <Text style={styles.priceValue}>{selectedProduct.avgMargin}</Text>
                                      </View>
                                    </View>
                                  </>
                                )}
                              </View>
                            );
                          })}

                          <View style={styles.basketTotal}>
                            <Text style={styles.basketTotalTitle}>Basket Total ({item.matches.length} Products)</Text>
                            <View style={styles.basketSummary}>
                              <View style={styles.basketItem}>
                                <Text style={styles.basketLabel}>Sale price</Text>
                                <Text style={styles.basketValue}>{basketTotal.salePrice}</Text>
                              </View>
                              <View style={styles.basketItem}>
                                <Text style={styles.basketLabel}>Profit</Text>
                                <Text style={styles.basketValue}>{basketTotal.profit}</Text>
                              </View>
                              <View style={styles.basketItem}>
                                <Text style={styles.basketLabel}>Avg. Margin</Text>
                                <Text style={styles.basketValue}>{basketTotal.avgMargin}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </Card>
                  );
                })}
              </View>
            )}

            {/* Contact Info - Keep this section */}
            <ContactInfo
              contact={{
                name: lead.contact.name,
                title: lead.contact.title,
                phone: lead.contact.phone,
                email: lead.contact.email
              }}
            />

            {/* Create Pitch CTA */}
            <TouchableOpacity style={styles.createPitchButton} onPress={() => {
              // Navigate to pitch creation
              router.push(`/leads/pitch/${lead.id}`);
            }}>
              <Text style={styles.createPitchButtonText}>Create Pitch</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Post Visit Checklist Tab - Reference: PRD/POST_VISIT_PRD.md - Story 1.2: Post Visit Tab Layout */}
      {activeTab === 'post-visit' && (
        <PostVisitTab
          leadId={lead.id}
          checklistItems={(lead as any).post_visit_checklist || []}
          notes={(lead as any).post_visit_notes || []}
          actions={(lead as any).post_visit_actions || []}
          onUpdateData={handlePostVisitDataUpdate}
        />
      )}
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
  venueCard: {
    marginBottom: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 16,
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
  venueDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 16,
    gap: 12,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
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
  enhancedMenuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemTitleSection: {
    flexDirection: 'column',
  },
  enhancedMenuItemName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  menuItemCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  priceSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  enhancedMenuItemPrice: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
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
  priceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceColumn: {
    flexBasis: '48%',
    marginBottom: 8,
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
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#087057',
    padding: 16,
    paddingTop: 8,
    minHeight: 56,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    flex: 0,
  },
  createPitchButton: {
    backgroundColor: '#087057',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createPitchButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#000',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  errorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#D11520',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  pendingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  pendingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  pendingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reviewSourceSection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  reviewSourceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  reviewSourceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  viewReviewButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewReviewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  sourceVerificationSection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sourceVerificationTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  sourceVerificationSource: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  sourceVerificationDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  sourceVerificationDisclaimer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  verificationLinksContainer: {
    marginBottom: 16,
  },
  verificationLinkButton: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  verificationLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  verificationLinkDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  menuSourceContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  menuSourceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  menuSourceLink: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuSourceText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  basketTotal: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  basketTotalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  basketSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  basketItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  basketLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  basketValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  tabContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  segmentedContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
});