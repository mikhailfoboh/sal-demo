import { StyleSheet, View, ScrollView, Linking, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { ProgressSteps } from '@/components/leads/ProgressSteps';
import { ContactInfo } from '@/components/shared/ContactInfo';
import { ProductSelector } from '@/components/leads/ProductSelector';
import { Segmented } from '@/components/ui/Segmented';
import { PostVisitTab } from '@/components/leads/PostVisitTab';
import { useLeadById, useLeads, PostVisitChecklistItem, PostVisitNote, PostVisitAction } from '@/hooks/useLeads';
import { EmptyState } from '@/components/ui/EmptyState';
import { Star, MapPin, Clock, ChevronDown } from 'lucide-react-native';
import { useState, useEffect } from 'react';

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
  
  // Debug logging - VERY PROMINENT
  console.log('🚨🚨🚨 LEAD DETAILS COMPONENT LOADED 🚨🚨🚨');
  console.log('📱 Lead Details - Active Tab:', activeTab);
  console.log('📱 Lead Details - Lead Stage:', lead?.stage);
  console.log('📱 Lead Details - Lead ID:', id);
  
  // FORCE COMPONENT UPDATE
  useEffect(() => {
    console.log('🔄 Lead Details - Component mounted/updated');
    console.log('🔄 Current lead:', lead?.name);
    console.log('🔄 Current stage:', lead?.stage);
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
  
  // Helper functions for styling
  const getStatusColor = (status: string, colors: any) => {
    switch (status) {
      case 'new': return colors.info;
      case 'contacted': return colors.warning;
      case 'sampling': return colors.primary;
      case 'won': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#EF4444';
      default: return '#6B7280';
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

  const handleChangeStatus = () => {
    // Handle changing lead status
    console.log('Change status');
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

  // Progress stepper data
  const stages = ['New', 'Contacted', 'Sampling', 'Won'];
  const currentStageIndex = stages.indexOf(lead.stage);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={lead.name} showBackButton />
      
      {/* Reference: PRD/POST_VISIT_PRD.md - Story 1.1: Tabbed Interface Implementation */}
      <View style={[styles.tabContainer, { backgroundColor: '#FF0000', padding: 20 }]}>
        {/* Debug indicator */}
        <Text style={[styles.debugText, { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' }]}>
          🚨 TABS RENDERED - Current Tab: {activeTab} 🚨
        </Text>
        
        <Text style={{ fontSize: 16, color: '#FFFFFF', marginBottom: 10 }}>
          Lead Stage: {lead.stage} | Should Show Tabs: {lead.stage !== 'new' ? 'YES' : 'NO'}
        </Text>
        
        <Segmented
          options={[
            { label: 'Lead Info', value: 'lead-info' },
            { label: 'Post Visit Checklist', value: 'post-visit' },
          ]}
          value={activeTab}
          onChange={(newTab) => {
            console.log('🚨 Tab changed to:', newTab);
            setActiveTab(newTab);
          }}
          containerStyle={{
            ...styles.segmentedContainer,
            backgroundColor: '#FFFFFF',
            borderWidth: 3,
            borderColor: '#000000'
          }}
        />
      </View>

      {/* Lead Info Tab - Reference: PRD/POST_VISIT_PRD.md - Story 1.2: Lead Info Tab */}
      {activeTab === 'lead-info' && (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Business Header */}
          <Card style={styles.headerCard}>
            <View style={styles.businessHeader}>
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{lead.name}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={styles.locationText}>{lead.location}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{lead.recentReview?.rating || 'N/A'}</Text>
                  <Text style={styles.reviewCount}>({lead.recentReview?.reviewCount || 0} reviews)</Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[styles.status, { backgroundColor: getStatusColor(lead.stage, colors) }]}>
                  {lead.stage.toUpperCase()}
                </Text>
              </View>
            </View>
          </Card>

          {/* Progress Steps */}
          <ProgressSteps 
            steps={stages}
            currentStep={currentStageIndex}
          />

          {/* Contact Info */}
          <ContactInfo
            contact={{
              name: lead.contact?.name,
              title: lead.contact?.title,
              phone: lead.contact?.phone,
              email: lead.contact?.email
            }}
          />

          {/* Create Pitch CTA - Reference: PRD/CREATE_PITCH_PRD.md - Story 1.1: Access Pitch Creation */}
          {lead.menuAnalysis && !lead.menuAnalysis.isPending && !lead.menuAnalysis.isProcessing && (
            <View style={styles.createPitchContainer}>
              <TouchableOpacity 
                style={styles.createPitchButton}
                onPress={() => router.push(`/leads/pitch/${lead.id}`)}
              >
                <Text style={styles.createPitchButtonText}>Create Pitch</Text>
                <Text style={styles.createPitchSubtext}>Generate data-driven sales presentation</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Menu Analysis */}
          {lead.menuAnalysis && (
            <Card style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>Menu Analysis</Text>
              <Text style={styles.analysisSubtitle}>AI-powered product matching based on menu items</Text>
              
              {lead.menuAnalysis.topItems?.map((item: MenuItem, index: number) => (
                <View key={index} style={styles.menuItem}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemPrice}>{item.price}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Additional Details */}
          <Card style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Additional Information</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{lead.category}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Venue Type:</Text>
              <Text style={styles.detailValue}>{lead.venueType}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Best Time:</Text>
              <Text style={styles.detailValue}>{lead.bestTime}</Text>
            </View>
            
            {lead.notes && lead.notes.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailValue}>{lead.notes[0].content}</Text>
              </View>
            )}
          </Card>
        </ScrollView>
      )}

      {/* Post Visit Checklist Tab - Reference: PRD/POST_VISIT_PRD.md - Story 1.2: Post Visit Tab Layout */}
      {activeTab === 'post-visit' && (
        <PostVisitTab
          leadId={lead.id}
          checklistItems={[]}
          notes={[]}
          actions={[]}
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
    paddingHorizontal: 24,
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
    paddingHorizontal: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 8,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 8,
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
  pitchAngleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  changeStatusButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  changeStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0C4A6E',
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
  menuSourceContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  menuSourceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0369A1',
    marginBottom: 4,
  },
  menuSourceLink: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  menuSourceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0C4A6E',
  },
  progressStepperContainer: {
    padding: 16,
  },
  createPitchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 16,
  },
  createPitchButton: {
    padding: 16,
    backgroundColor: '#087057',
    borderRadius: 8,
    alignItems: 'center',
  },
  createPitchText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  createPitchSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
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
  scrollContainer: {
    flex: 1,
  },
  headerCard: {
    marginBottom: 16,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
  },
  status: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  analysisCard: {
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  analysisSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 16,
  },
  menuItemName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  detailsCard: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  createPitchButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
});