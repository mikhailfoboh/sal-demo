import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format, eachDayOfInterval, isEqual, isToday } from 'date-fns';

interface DatePickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
}

export function DatePicker({ selectedDate, onSelectDate, minDate, maxDate }: DatePickerProps) {
  const dates = eachDayOfInterval({ start: minDate, end: maxDate });

  return (
    <View style={styles.container}>
      <Text style={styles.monthText}>{format(selectedDate, 'MMMM yyyy')}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}
      >
        {dates.map((date) => {
          const isSelected = isEqual(date, selectedDate);
          const isTodayDate = isToday(date);
          
          return (
            <TouchableOpacity
              key={date.toISOString()}
              onPress={() => onSelectDate(date)}
              style={[
                styles.dateButton,
                isSelected && styles.selectedDate,
                isTodayDate && styles.todayDate
              ]}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedText,
                isTodayDate && styles.todayText
              ]}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[
                styles.dateText,
                isSelected && styles.selectedText,
                isTodayDate && styles.todayText
              ]}>
                {format(date, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  monthText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    marginLeft: 4,
  },
  datesContainer: {
    paddingHorizontal: 4,
  },
  dateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    minWidth: 56,
  },
  selectedDate: {
    backgroundColor: '#2563EB',
  },
  todayDate: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  dayText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: '#2563EB',
  },
});