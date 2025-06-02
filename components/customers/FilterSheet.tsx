import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  activeFilters: {
    healthStatus: string[];
    segment: string[];
    territory: string[];
  };
  onApply: (filters: any) => void;
}

export function FilterSheet({ visible, onClose, activeFilters, onApply }: FilterSheetProps) {
  const { colors } = useTheme();
  const [tempFilters, setTempFilters] = React.useState(activeFilters);

  if (!visible) return null;

  const healthStatusOptions = ['Healthy', 'At Risk', 'Churned'];
  const segmentOptions = ['Enterprise', 'Mid-Market', 'SMB'];
  const territoryOptions = ['North', 'South', 'East', 'West'];

  const toggleFilter = (category: keyof typeof tempFilters, value: string) => {
    setTempFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      return {
        ...prev,
        [category]: updated
      };
    });
  };

  const handleApply = () => {
    onApply(tempFilters);
  };

  const handleReset = () => {
    setTempFilters({
      healthStatus: [],
      segment: [],
      territory: []
    });
  };

  const FilterSection = ({ title, options, category }: { 
    title: string;
    options: string[];
    category: keyof typeof tempFilters;
  }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterChip,
              tempFilters[category].includes(option) && styles.filterChipActive
            ]}
            onPress={() => toggleFilter(category, option)}
          >
            <Text
              style={[
                styles.filterChipText,
                tempFilters[category].includes(option) && styles.filterChipTextActive
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Filters</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <FilterSection
            title="Health Status"
            options={healthStatusOptions}
            category="healthStatus"
          />
          
          <FilterSection
            title="Segment"
            options={segmentOptions}
            category="segment"
          />
          
          <FilterSection
            title="Territory"
            options={territoryOptions}
            category="territory"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Reset"
            variant="outline"
            onPress={handleReset}
            style={styles.resetButton}
          />
          <Button
            title="Apply Filters"
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#EEF2FF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});