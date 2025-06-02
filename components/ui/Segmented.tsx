import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SegmentedOption {
  label: string;
  value: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  containerStyle?: ViewStyle;
}

export function Segmented({ options, value, onChange, containerStyle }: SegmentedProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              {
                backgroundColor: isSelected ? colors.primary : 'transparent',
                borderTopLeftRadius: isFirst ? 8 : 0,
                borderBottomLeftRadius: isFirst ? 8 : 0,
                borderTopRightRadius: isLast ? 8 : 0,
                borderBottomRightRadius: isLast ? 8 : 0,
                borderRightWidth: isLast ? 1 : 0,
              },
              isSelected && styles.selectedOption,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: isSelected ? colors.white : colors.textSecondary,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});