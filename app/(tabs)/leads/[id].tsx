import { StyleSheet, View, ScrollView, Linking } from 'react-native';
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
    router.push(`/notes?leadId=${id}`);
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
              role: lead.contact.title,
              phone: lead.contact.phone,
              email: lead.contact.email
            }}
          />
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
});