'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import { LeadCard } from '@/components/leads/LeadCard';
import { WebNavigation } from '@/components/ui/WebNavigation';
import { leadStyles } from '@/styles/components/leads';

const FILTER_OPTIONS = ['All', 'New', 'Contacted', 'Sampling', 'Won'];

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
  },
  {
    id: '2',
    businessName: 'Zest Kitchen',
    location: 'Paddington',
    category: 'Restaurant',
    rating: 4.2,
    reviewCount: 89,
    status: 'contacted' as const,
    nextAction: 'Send Sample',
  },
  {
    id: '3',
    businessName: 'Olive Grove',
    location: 'Bondi',
    category: 'Mediterranean',
    rating: 4.8,
    reviewCount: 156,
    status: 'sampling' as const,
    nextAction: 'Follow Up',
  },
  {
    id: '4',
    businessName: 'Urban Plate',
    location: 'CBD',
    category: 'Modern Australian',
    rating: 4.6,
    reviewCount: 203,
    status: 'won' as const,
    nextAction: 'Onboard',
  },
];

function LeadsScreen() {
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

  const handleLeadPress = (leadId: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/leads/${leadId}`;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={leadStyles.container}>
        <View style={leadStyles.header}>
          <Text style={leadStyles.headerTitle}>Discovery Leads</Text>
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

        <ScrollView style={{ flex: 1 }}>
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
              onPress={() => handleLeadPress(lead.id)}
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
      </View>
      <WebNavigation currentPath="/leads" />
    </View>
  );
}

export default function LeadsPage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <LeadsScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 