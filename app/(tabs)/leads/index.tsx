import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LeadCard } from '@/components/leads/LeadCard';
import { leadStyles } from '@/styles/components/leads';
import { planStyles } from '@/styles/components/plan';

const FILTER_OPTIONS = ['All', 'New Openings', 'Most Popular', 'Nearby'];

// Mock data - replace with real data later
const MOCK_LEADS = [
  {
    id: '1',
    businessName: 'Café Verde Oliva',
    location: 'Surry Hills',
    category: 'Café',
    rating: 4.5,
    reviewCount: 128,
    status: 'new' as const,
    nextAction: 'Visit Venue',
    productMatch: '3 from menu',
    upcomingEvent: 'Exhibiting at Taste of Sydney - June 14-16',
    localBuzz: 'Featured in Broadsheet\'s top 10 pizza spots',
  },
  {
    id: '2',
    businessName: 'Café Verde Oliva',
    location: 'Surry Hills',
    category: 'Café',
    rating: 4.5,
    reviewCount: 128,
    status: 'contacted' as const,
    nextAction: 'Send Sample',
    note: 'Interested in Premium Mozzarella',
  },
  {
    id: '3',
    businessName: 'Café Verde Oliva',
    location: 'Surry Hills',
    category: 'Café',
    rating: 4.5,
    reviewCount: 128,
    status: 'sampling' as const,
    nextAction: 'Send Sample',
    reminder: 'Follow up in 3 days',
  },
  {
    id: '4',
    businessName: 'Café Verde Oliva',
    location: 'Surry Hills',
    category: 'Café',
    rating: 4.5,
    reviewCount: 128,
    status: 'won' as const,
    nextAction: 'Send Sample',
    reminder: 'Follow up in 3 days',
  },
];

export default function LeadsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = MOCK_LEADS.filter(lead => {
    if (selectedFilter !== 'All' && lead.status.toLowerCase() !== selectedFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lead.businessName.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <SafeAreaView style={leadStyles.container} edges={['top']}>
      <View style={[planStyles.header, { paddingBottom: 32 }]}>
        <View style={planStyles.profileSection}>
          <View style={planStyles.avatar}>
            <Text style={planStyles.avatarText}>MS</Text>
          </View>
          <View style={planStyles.userInfo}>
            <Text style={planStyles.userName}>Mark Smith</Text>
            <Text style={planStyles.userTitle}>Sales Rep at TwoZipz Inc.</Text>
          </View>
        </View>
      </View>

      <View style={leadStyles.filterContainer}>
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              leadStyles.filterTab,
              selectedFilter === filter && leadStyles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                leadStyles.filterText,
                selectedFilter === filter && leadStyles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={leadStyles.sectionHeader}>
        <Text style={leadStyles.sectionTitle}>Your Leads</Text>
      </View>

      <ScrollView>
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            businessName={lead.businessName}
            location={lead.location}
            category={lead.category}
            rating={lead.rating}
            reviewCount={lead.reviewCount}
            status={lead.status}
            nextAction={lead.nextAction}
            productMatch={lead.productMatch}
            upcomingEvent={lead.upcomingEvent}
            localBuzz={lead.localBuzz}
            note={lead.note}
            reminder={lead.reminder}
            onPress={() => router.push(`/leads/${lead.id}`)}
          />
        ))}
      </ScrollView>

      <View style={leadStyles.searchContainer}>
        <TextInput
          style={leadStyles.searchInput}
          placeholder="Search leads by name or location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </SafeAreaView>
  );
} 