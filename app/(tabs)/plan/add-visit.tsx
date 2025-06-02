import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { WeekSelector } from '@/components/plan/WeekSelector';
import { CustomerSelector } from '@/components/CustomerSelector';
import { TimePicker } from '@/components/ui/TimePicker';
import { useCustomers } from '@/hooks/useCustomers';

export default function AddVisitScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { customers } = useCustomers();
  
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('30 minutes');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  
  const handleAddVisit = () => {
    // Implementation for adding a visit
    console.log({
      date,
      time,
      duration,
      customerId: selectedCustomer,
      notes
    });
    
    router.replace('..');
  };
  
  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Schedule Visit" 
        showBackButton
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <CustomerSelector
            customers={customers}
            selectedCustomerId={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
          />
          
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <Card style={styles.dateTimeCard}>
            <WeekSelector 
              selectedDate={date}
              onSelectDate={setDate}
            />
            
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>Time</Text>
                <TimePicker 
                  selectedTime={time}
                  onSelectTime={setTime}
                />
              </View>
              
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>Duration</Text>
                <TimePicker 
                  selectedTime={duration}
                  onSelectTime={setDuration}
                  options={['15 minutes', '30 minutes', '45 minutes', '1 hour']}
                />
              </View>
            </View>
          </Card>
          
          <Text style={styles.sectionTitle}>Notes</Text>
          <Input
            placeholder="Add any notes about this visit..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.notesInput}
          />
          
          {selectedCustomerData && (
            <Card style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>Visit Suggestion</Text>
              <Text style={styles.suggestionText}>
                {selectedCustomerData.name} is usually open from 9:00 AM to 5:00 PM on {format(date, 'EEEE')}s.
              </Text>
              {selectedCustomerData.healthStatus === 'at-risk' && (
                <Text style={styles.warningText}>
                  This customer hasn't placed an order in 3 weeks. Consider discussing their recent order patterns.
                </Text>
              )}
            </Card>
          )}
          
          <Button
            title="Schedule Visit"
            variant="primary"
            onPress={handleAddVisit}
            style={styles.addButton}
            disabled={!selectedCustomer}
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    marginTop: 16,
  },
  dateTimeCard: {
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  timeField: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  suggestionCard: {
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  suggestionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#0369A1',
    marginBottom: 8,
  },
  suggestionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0C4A6E',
    marginBottom: 8,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#92400E',
    marginTop: 8,
  },
  addButton: {
    marginTop: 24,
  },
}); 