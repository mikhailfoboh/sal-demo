import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClockCounterClockwise, CheckCircle, CalendarPlus } from 'phosphor-react-native';
import { format, addDays, isSameDay } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { DailyPlanView } from '@/components/plan/DailyPlanView';
import { WeekSelector } from '@/components/plan/WeekSelector';
import { PriorityAlert } from '@/components/plan/PriorityAlert';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePlans } from '@/hooks/usePlans';
import { planStyles } from '@/styles/components/plan';

export default function PlanScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { plans, priorities, isLoading } = usePlans();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const today = new Date();
  const formattedDate = format(selectedDate, 'EEEE, MMMM d');
  
  const selectedDayPlan = plans.find(plan => 
    isSameDay(new Date(plan.date), selectedDate)
  );

  const pendingTasks = selectedDayPlan?.tasks.filter(t => !t.completed).length || 0;
  const completedTasks = selectedDayPlan?.tasks.filter(t => t.completed).length || 0;
  const weekTasks = plans.reduce((acc, plan) => acc + plan.tasks.length, 0);
  
  const hasPriority = priorities.length > 0;

  return (
    <SafeAreaView style={planStyles.screenContainer} edges={['top']}>
      <View style={planStyles.header}>
        <View style={planStyles.profileSection}>
          <View style={planStyles.avatar}>
            <Text style={planStyles.avatarText}>MS</Text>
          </View>
          <View style={planStyles.userInfo}>
            <Text style={planStyles.userName}>Mark Smith</Text>
            <Text style={planStyles.userTitle}>Sales Rep at TwoZipz Inc.</Text>
          </View>
        </View>

        <View style={planStyles.statsContainer}>
          <View style={[planStyles.statCard, planStyles.pendingCard]}>
            <Text style={[planStyles.statValue, planStyles.statLabelOrange]}>{pendingTasks}</Text>
            <Text style={[planStyles.statLabel, planStyles.statLabelOrange]}>Pending</Text>
            <View style={[planStyles.statIconContainer, planStyles.pendingIconContainer]}>
              <ClockCounterClockwise size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={[planStyles.statCard, planStyles.completedCard]}>
            <Text style={[planStyles.statValue, planStyles.statLabelGreen]}>{completedTasks}</Text>
            <Text style={[planStyles.statLabel, planStyles.statLabelGreen]}>Completed</Text>
            <View style={[planStyles.statIconContainer, planStyles.completedIconContainer]}>
              <CheckCircle size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={[planStyles.statCard, planStyles.weekCard]}>
            <Text style={[planStyles.statValue, planStyles.statLabelGray]}>{weekTasks}</Text>
            <Text style={[planStyles.statLabel, planStyles.statLabelGray]}>This Week</Text>
            <View style={[planStyles.statIconContainer, planStyles.weekIconContainer]}>
              <CalendarPlus size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {hasPriority && (
          <View style={{ marginTop: 20 }}>
            <PriorityAlert 
              priority={priorities[0]} 
              onPress={() => router.push(`../../customers/${priorities[0].customerId}`)}
            />
          </View>
        )}
      </View>
      
      <WeekSelector 
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      
      {selectedDayPlan ? (
        <DailyPlanView 
          plan={selectedDayPlan}
          onVisitPress={(id) => router.push(`../../customers/${id}`)}
          onTaskPress={(id) => console.log('Task pressed', id)}
          onToggleComplete={(itemId, type) => {
            // Handle completion toggle
            console.log('Toggle complete:', itemId, type);
          }}
        />
      ) : (
        <EmptyState
          icon="clipboard"
          title="No plans for this day"
          message="Tap the + button to add a visit or task to your schedule."
        />
      )}
    </SafeAreaView>
  );
} 