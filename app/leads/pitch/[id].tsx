import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, ArrowRight, Check, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Mock data for POC
const mockPitchData = {
  venue: {
    name: 'The Local Bar',
    type: 'Bar & Restaurant',
  },
  analysis: {
    menuItems: 24,
    matchedProducts: 18,
    gapProducts: 6,
    confidence: 0.85,
  },
  suggestions: [
    {
      menuItem: 'House Red Wine',
      currentProduct: 'Generic Red Blend',
      suggestion: 'Premium Shiraz Reserve',
      reasoning: 'Higher margin, better quality, similar price point',
      confidence: 0.92,
      priceImpact: '+15%',
    },
    {
      menuItem: 'Craft Beer Selection',
      currentProduct: 'Various Local Breweries',
      suggestion: 'Artisanal IPA Collection',
      reasoning: 'Exclusive distribution, consistent supply',
      confidence: 0.88,
      priceImpact: '+8%',
    },
    {
      menuItem: 'Premium Spirits',
      currentProduct: 'Standard Well Drinks',
      suggestion: 'Craft Distillery Package',
      reasoning: 'Unique offering, higher perceived value',
      confidence: 0.85,
      priceImpact: '+20%',
    },
  ],
  gaps: [
    {
      category: 'Natural Wines',
      reasoning: 'Growing trend in similar venues',
      suggestion: 'Introduce organic wine selection',
    },
    {
      category: 'Non-Alcoholic Options',
      reasoning: 'Limited premium mocktail ingredients',
      suggestion: 'Craft mixer package',
    },
  ],
};

export default function PitchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Pitch Analysis" 
        showBackButton
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.summaryCard}>
            <Text style={styles.venueName}>{mockPitchData.venue.name}</Text>
            <Text style={styles.venueType}>{mockPitchData.venue.type}</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockPitchData.analysis.menuItems}</Text>
                <Text style={styles.statLabel}>Menu Items</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockPitchData.analysis.matchedProducts}</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockPitchData.analysis.gapProducts}</Text>
                <Text style={styles.statLabel}>Gaps</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{(mockPitchData.analysis.confidence * 100).toFixed(0)}%</Text>
                <Text style={styles.statLabel}>Confidence</Text>
              </View>
            </View>
          </Card>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Replacements</Text>
            {mockPitchData.suggestions.map((suggestion, index) => (
              <Card key={index} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <Text style={styles.menuItem}>{suggestion.menuItem}</Text>
                  <View style={[
                    styles.confidenceTag,
                    { backgroundColor: colors.infoLight }
                  ]}>
                    <Text style={[styles.confidenceText, { color: colors.info }]}>
                      {(suggestion.confidence * 100).toFixed(0)}% Match
                    </Text>
                  </View>
                </View>

                <View style={styles.replacementRow}>
                  <View style={styles.replacement}>
                    <View style={styles.replacementHeader}>
                      <X size={16} color={colors.error} />
                      <Text style={[styles.replacementLabel, { color: colors.error }]}>Current</Text>
                    </View>
                    <Text style={styles.replacementProduct}>{suggestion.currentProduct}</Text>
                  </View>
                  <ArrowRight size={20} color={colors.textSecondary} />
                  <View style={styles.replacement}>
                    <View style={styles.replacementHeader}>
                      <Check size={16} color={colors.success} />
                      <Text style={[styles.replacementLabel, { color: colors.success }]}>Suggested</Text>
                    </View>
                    <Text style={styles.replacementProduct}>{suggestion.suggestion}</Text>
                  </View>
                </View>

                <Text style={styles.reasoning}>{suggestion.reasoning}</Text>
                
                <View style={styles.impactTag}>
                  <Text style={styles.impactText}>
                    Potential Impact: {suggestion.priceImpact}
                  </Text>
                </View>
              </Card>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Menu Gaps & Opportunities</Text>
            {mockPitchData.gaps.map((gap, index) => (
              <Card key={index} style={styles.gapCard}>
                <Text style={styles.gapCategory}>{gap.category}</Text>
                <Text style={styles.gapReasoning}>{gap.reasoning}</Text>
                <Text style={styles.gapSuggestion}>{gap.suggestion}</Text>
              </Card>
            ))}
          </View>

          <View style={styles.actions}>
            <Button
              title="Generate Quote"
              variant="primary"
              onPress={() => {}}
              style={styles.actionButton}
              leftIcon={<Package size={18} color="#FFFFFF" />}
            />
            <Button
              title="Schedule Meeting"
              variant="secondary"
              onPress={() => {}}
              style={styles.actionButton}
            />
          </View>
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
    marginBottom: 24,
  },
  venueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 4,
  },
  venueType: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  suggestionCard: {
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItem: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#111827',
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
  replacementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  replacement: {
    flex: 1,
  },
  replacementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  replacementLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  replacementProduct: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#374151',
  },
  reasoning: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  impactTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  impactText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4B5563',
  },
  gapCard: {
    marginBottom: 12,
  },
  gapCategory: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#111827',
    marginBottom: 8,
  },
  gapReasoning: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  gapSuggestion: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4F46E5',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});