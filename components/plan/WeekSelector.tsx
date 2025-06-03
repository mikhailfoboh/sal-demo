import { View, Text, TouchableOpacity } from 'react-native';
import { format, addDays, isSameDay, startOfWeek, endOfWeek, getWeekOfMonth, addWeeks, subWeeks, startOfDay, isBefore } from 'date-fns';
import { Calendar, ArrowCircleLeft, ArrowCircleRight } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';
import { planStyles } from '@/styles/components/plan';

interface WeekSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeekSelector({ selectedDate, onSelectDate }: WeekSelectorProps) {
  const { colors } = useTheme();
  const today = new Date();
  
  // Get start and end of current week based on selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  // Generate dates for the week
  const dates = Array.from(
    { length: 7 }, 
    (_, i) => addDays(weekStart, i)
  );

  // Get current month and week number
  const currentMonth = format(selectedDate, 'MMMM');
  
  // Calculate week number more intuitively
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const firstMondayOfMonth = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const selectedWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekNumber = Math.floor((selectedWeekStart.getTime() - firstMondayOfMonth.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  const handlePreviousWeek = () => {
    const previousWeek = subWeeks(selectedDate, 1);
    onSelectDate(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(selectedDate, 1);
    onSelectDate(nextWeek);
  };

  return (
    <View style={planStyles.weekSelectorContainer}>
      <View style={planStyles.weekHeader}>
        <View style={planStyles.monthContainer}>
          <View style={planStyles.monthIconContainer}>
            <Calendar size={18} color="white" />
          </View>
          <Text style={planStyles.monthText}>{currentMonth}</Text>
        </View>
        
        <View style={planStyles.weekNavigation}>
          <TouchableOpacity onPress={handlePreviousWeek} style={planStyles.navButton}>
            <ArrowCircleLeft size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={planStyles.weekText}>Week {weekNumber}</Text>
          <TouchableOpacity onPress={handleNextWeek} style={planStyles.navButton}>
            <ArrowCircleRight size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={planStyles.daysContainer}>
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isPast = isBefore(date, startOfDay(today)) && !isSelected;
          
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                planStyles.dateButton,
                isSelected && planStyles.dateButtonSelected,
                isPast && planStyles.pastDate
              ]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[
                planStyles.dayText,
                isSelected && planStyles.selectedText,
                isPast && planStyles.pastText
              ]}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[
                planStyles.dateText,
                isSelected && planStyles.selectedText,
                isPast && planStyles.pastText
              ]}>
                {format(date, 'd')}
              </Text>
              {isToday && (
                <View style={[
                  planStyles.todayDot,
                  { backgroundColor: isSelected ? '#F8FCFA' : colors.primary }
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}