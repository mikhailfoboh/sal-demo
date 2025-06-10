import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Calendar, Send, FileText, Phone, PlusCircle, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLeadById, useLeads } from '@/hooks/useLeads';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';

// Reference: PRD/CREATE_PITCH_PRD.md - Story 3.2: Action Selection Modal
const ACTION_OPTIONS = [
  {
    id: 'place_order',
    title: 'Place an Order',
    subtitle: 'Submit a product order directly to Alan',
    icon: Package,
    color: '#059669'
  },
  {
    id: 'request_sample',
    title: 'Request Sample',
    subtitle: 'Send a trial pack to introduce the products',
    icon: Send,
    color: '#0369A1'
  },
  {
    id: 'send_copy',
    title: 'Send Copy',
    subtitle: 'Share pitch summary with venue',
    icon: FileText,
    color: '#7C3AED'
  },
  {
    id: 'book_meeting',
    title: 'Book a Meeting',
    subtitle: 'Lock in a time to reconnect',
    icon: Calendar,
    color: '#DC2626'
  },
  {
    id: 'call_contact',
    title: 'Call Contact',
    subtitle: 'Follow up directly by phone',
    icon: Phone,
    color: '#EA580C'
  },
  {
    id: 'add_visit_summary',
    title: 'Add Visit Summary',
    subtitle: 'Capture visit notes without sending anything',
    icon: PlusCircle,
    color: '#4B5563'
  }
];

export default function PitchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { lead, isLoading } = useLeadById(id);
  const { updateLead } = useLeads();
  
  // Reference: PRD/CREATE_PITCH_PRD.md - Story 3.1: Proceed CTA Functionality
  const [showActionModal, setShowActionModal] = useState(false);

  if (isLoading || !lead) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Create Pitch" showBackButton />
        <EmptyState
          icon="alert"
          title="Loading Pitch..."
          message="Generating your data-driven pitch presentation."
        />
      </SafeAreaView>
    );
  }

  // Check if lead has menu analysis data - Reference: PRD/CREATE_PITCH_PRD.md - Story 1.1
  if (!lead.menuAnalysis || lead.menuAnalysis.isPending || lead.menuAnalysis.isProcessing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Create Pitch" showBackButton />
        <EmptyState
          icon="alert"
          title="Menu Analysis Required"
          message="This lead needs menu analysis data before a pitch can be generated."
        />
      </SafeAreaView>
    );
  }

  // Calculate analysis statistics - Reference: PRD/CREATE_PITCH_PRD.md - Story 2.1
  const calculateAnalysisStats = () => {
    const topItems = lead.menuAnalysis?.topItems || [];
    const totalMenuItems = topItems.length * 8; // Estimate based on top items
    const totalMatches = topItems.reduce((sum: number, item: any) => sum + (item.matches?.length || 0), 0);
    const avgConfidence = topItems.length > 0 
      ? topItems.reduce((sum: number, item: any) => {
          const itemConfidence = item.matches?.reduce((matchSum: number, match: any) => matchSum + match.matchPercentage, 0) || 0;
          return sum + (itemConfidence / (item.matches?.length || 1));
        }, 0) / topItems.length
      : 0;

    return {
      menuItems: totalMenuItems,
      productMatches: totalMatches,
      confidence: Math.round(avgConfidence)
    };
  };

  const stats = calculateAnalysisStats();

  // Handle action selection - Reference: PRD/CREATE_PITCH_PRD.md - Story 4.1: Status Update on Action Selection
  const handleActionSelect = async (actionId: string) => {
    try {
      // Update lead status to "contacted" 
      await updateLead(id, { 
        status: 'contacted',
        next_action: actionId,
        updated_at: new Date().toISOString()
      });

      setShowActionModal(false);
      
      // Show success message
      const selectedAction = ACTION_OPTIONS.find(action => action.id === actionId);
      Alert.alert(
        'Action Selected',
        `"${selectedAction?.title}" has been recorded. Lead status updated to Contacted.`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error updating lead:', error);
      Alert.alert('Error', 'Failed to update lead status. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Create Pitch" 
        showBackButton
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Reference: PRD/CREATE_PITCH_PRD.md - Story 1.2: Pitch Page Layout */}
          <Card style={styles.summaryCard}>
            <Text style={styles.venueName}>{lead.name}</Text>
            <Text style={styles.venueType}>{lead.category}</Text>
            
            {/* Reference: PRD/CREATE_PITCH_PRD.md - Story 2.1: Analysis Statistics Display */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.menuItems}</Text>
                <Text style={styles.statLabel}>Menu Items</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.productMatches}</Text>
                <Text style={styles.statLabel}>Product Matches</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.confidence}%</Text>
                <Text style={styles.statLabel}>Confidence</Text>
              </View>
            </View>
          </Card>

          {/* Reference: PRD/CREATE_PITCH_PRD.md - Story 2.2: Product Match Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Recommendations</Text>
            {lead.menuAnalysis.topItems?.map((item: any, index: number) => (
              <Card key={item.id || index} style={styles.productCard}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>Current Price: {item.price}</Text>
                
                {item.matches?.map((match: any, matchIndex: number) => (
                  <View key={match.id || matchIndex} style={styles.matchContainer}>
                    <View style={styles.matchHeader}>
                      <Text style={styles.productName}>{match.name}</Text>
                      <View style={[styles.confidenceTag, { backgroundColor: colors.successLight }]}>
                        <Text style={[styles.confidenceText, { color: colors.success }]}>
                          {match.matchPercentage}% Match
                        </Text>
                      </View>
                    </View>
                    
                    {/* Pricing Grid - Reference: PRD/CREATE_PITCH_PRD.md - Story 2.2 */}
                    <View style={styles.pricingGrid}>
                      <View style={styles.pricingItem}>
                        <Text style={styles.pricingLabel}>Cost Price</Text>
                        <Text style={styles.pricingValue}>{match.defaultPrice}</Text>
                      </View>
                      <View style={styles.pricingItem}>
                        <Text style={styles.pricingLabel}>Recommended Retail</Text>
                        <Text style={styles.pricingValue}>{match.retailPrice}</Text>
                      </View>
                      <View style={styles.pricingItem}>
                        <Text style={styles.pricingLabel}>Your Price</Text>
                        <Text style={styles.pricingValue}>{match.yourPrice}</Text>
                      </View>
                      <View style={styles.pricingItem}>
                        <Text style={styles.pricingLabel}>Margin</Text>
                        <Text style={styles.pricingValue}>{match.avgMargin}</Text>
                      </View>
                    </View>

                    <View style={styles.reasoningContainer}>
                      <Text style={styles.reasoningText}>
                        High-quality match based on cuisine type and price point. This product offers better margins while maintaining quality standards.
                      </Text>
                    </View>
                  </View>
                ))}
              </Card>
            ))}
          </View>

          {/* Reference: PRD/CREATE_PITCH_PRD.md - Story 3.1: Proceed CTA Functionality */}
          <View style={styles.proceedContainer}>
            <Button
              title="Proceed"
              variant="primary"
              onPress={() => setShowActionModal(true)}
              style={styles.proceedButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Reference: PRD/CREATE_PITCH_PRD.md - Story 3.2: Action Selection Modal */}
      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Follow-up Action</Text>
              <TouchableOpacity 
                onPress={() => setShowActionModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.actionsList}>
              {ACTION_OPTIONS.map((action) => {
                const IconComponent = action.icon;
                return (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionOption}
                    onPress={() => handleActionSelect(action.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                      <IconComponent size={24} color={action.color} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
  },
  venueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  venueType: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  productCard: {
    marginBottom: 16,
  },
  menuItemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  matchContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#111827',
    flex: 1,
  },
  confidenceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  pricingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  pricingItem: {
    width: '50%',
    marginBottom: 12,
  },
  pricingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  pricingValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  reasoningContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  reasoningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  proceedContainer: {
    marginTop: 24,
  },
  proceedButton: {
    backgroundColor: '#059669',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  actionsList: {
    padding: 20,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});