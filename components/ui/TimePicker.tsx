import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Card } from './Card';

interface TimePickerProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
  options?: string[];
}

export function TimePicker({ 
  selectedTime, 
  onSelectTime,
  options = generateTimeOptions()
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Card style={styles.selectedTime}>
          <Text style={styles.selectedTimeText}>{selectedTime}</Text>
        </Card>
      </TouchableOpacity>

      {isOpen && (
        <Card style={styles.optionsContainer}>
          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
            {options.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.option,
                  time === selectedTime && styles.selectedOption
                ]}
                onPress={() => {
                  onSelectTime(time);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    time === selectedTime && styles.selectedOptionText
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>
      )}
    </View>
  );
}

function generateTimeOptions(): string[] {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const displayMinute = minute.toString().padStart(2, '0');
      times.push(`${displayHour}:${displayMinute} ${period}`);
    }
  }
  return times;
}

const styles = StyleSheet.create({
  selectedTime: {
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  selectedTimeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  optionsList: {
    padding: 8,
  },
  option: {
    padding: 12,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#374151',
  },
  selectedOptionText: {
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
});