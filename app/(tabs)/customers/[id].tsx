import { StyleSheet, View, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { CustomerHeader } from '@/components/customers/CustomerHeader';
import { ActionButtons } from '@/components/customers/ActionButtons';
import { VenueInfo } from '@/components/customers/VenueInfo';
import { UpcomingActions } from '@/components/customers/UpcomingActions';
import { SuggestedActions } from '@/components/customers/SuggestedActions';
import { CustomerNotes } from '@/components/customers/CustomerNotes';
import { OrderHistory } from '@/components/customers/OrderHistory';
import { TopProducts } from '@/components/customers/TopProducts';
import { ContactInfo } from '@/components/shared/ContactInfo';
import { useCustomerById } from '@/hooks/useCustomers';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { customer, isLoading } = useCustomerById(id);
  
  if (isLoading || !customer) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Customer Details" showBackButton />
        <EmptyState
          icon="alert"
          title="Loading..."
          message="Please wait while we fetch the customer details."
        />
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${customer.contact.phone}`);
  };

  const handleScheduleVisit = () => {
    router.push('/plan/add-visit');
  };

  const handleActionPress = (action: any) => {
    // Handle action press based on type
    console.log('Action pressed:', action);
  };

  const handleViewAllNotes = () => {
    router.push(`/notes?customerId=${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={customer.name} showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.summaryCard}>
            <CustomerHeader
              name={customer.name}
              segment={customer.segment}
              healthStatus={customer.healthStatus}
              churnRisk={customer.churnRisk}
            />
            
            <ActionButtons
              onCall={handleCall}
              onScheduleVisit={handleScheduleVisit}
            />
          </Card>
          
          <UpcomingActions
            actions={customer.upcomingActions}
            onActionPress={handleActionPress}
          />
          
          <SuggestedActions
            actions={customer.suggestedActions}
            onActionPress={handleActionPress}
          />
          
          <CustomerNotes
            notes={customer.notes.slice(0, 3)}
            onNotePress={(noteId) => router.push(`/notes/${noteId}`)}
            onViewAll={handleViewAllNotes}
          />
          
          <OrderHistory orders={customer.orders} />
          
          <TopProducts products={customer.topProducts} />
          
          <VenueInfo
            venueType={customer.venueType}
            address={customer.address}
          />
          
          <ContactInfo contact={customer.contact} />
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