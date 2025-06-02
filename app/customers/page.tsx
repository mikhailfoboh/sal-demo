'use client';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppProvider } from '@/context/AppContext';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { WebNavigation } from '@/components/ui/WebNavigation';
import { useCustomers } from '@/hooks/useCustomers';

function CustomersScreen() {
  const { colors } = useTheme();
  const { customers, isLoading } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const statuses = ['All', 'Healthy', 'Attention', 'At risk', 'Inactive'];

  const filteredCustomers = customers.filter(customer => {
    const matchesStatus = selectedStatus === 'All' || 
                         customer.healthStatus.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.segment.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const atRiskCount = customers.filter(c => 
    c.healthStatus === 'at-risk' || c.healthStatus === 'attention'
  ).length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'healthy':
        return { color: '#059669', icon: <ArrowUpRight size={16} color="#059669" /> };
      case 'attention':
        return { color: '#F59E0B', icon: <ArrowDownRight size={16} color="#F59E0B" /> };
      case 'at-risk':
        return { color: '#DC2626', icon: <ArrowDownRight size={16} color="#DC2626" /> };
      case 'inactive':
        return { color: '#6B7280', icon: null };
      default:
        return { color: '#6B7280', icon: null };
    }
  };

  const handleCustomerPress = (customerId: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/customers/${customerId}`;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Customers</Text>
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={18} color={colors.textSecondary} />}
            containerStyle={styles.searchInput}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipActive
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.filterChipText,
                selectedStatus === status && styles.filterChipTextActive
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {atRiskCount > 0 && (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>
              {atRiskCount} customer{atRiskCount > 1 ? 's' : ''} haven't reordered in 2+ weeks
            </Text>
            <Text style={styles.alertSubtext}>
              Consider reaching out to prevent churn
            </Text>
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredCustomers.length > 0 ? (
            <View style={styles.customersList}>
              {filteredCustomers.map((customer) => {
                const statusStyle = getStatusStyle(customer.healthStatus);
                const value = parseInt(customer.lastOrder?.match(/\$(\d+)K/)?.[1] || '0');
                
                return (
                  <TouchableOpacity
                    key={customer.id}
                    style={styles.customerCard}
                    onPress={() => handleCustomerPress(customer.id)}
                  >
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.customerName}>{customer.name}</Text>
                        <View style={styles.locationContainer}>
                          <MapPin size={14} color={colors.textSecondary} />
                          <Text style={styles.location}>{customer.territory}</Text>
                        </View>
                      </View>
                      <View style={[
                        styles.statusTag,
                        { backgroundColor: `${statusStyle.color}10` }
                      ]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                          {customer.healthStatus.replace('-', ' ')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.orderInfo}>
                      <View style={styles.lastOrder}>
                        <Clock size={14} color={colors.textSecondary} />
                        <Text style={styles.lastOrderText}>
                          Last order: {customer.lastOrder || 'Never'}
                        </Text>
                      </View>
                      <View style={styles.valueContainer}>
                        {statusStyle.icon}
                        <Text style={[styles.valueText, { color: statusStyle.color }]}>
                          ${value}K
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actions}>
                      <TouchableOpacity 
                        style={styles.callButton}
                        onPress={() => {/* Handle call */}}
                      >
                        <Text style={styles.callButtonText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.detailsButton}
                        onPress={() => handleCustomerPress(customer.id)}
                      >
                        <Text style={styles.detailsButtonText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <EmptyState
              icon="clipboard"
              title="No customers found"
              message={
                searchQuery
                  ? "We couldn't find any customers matching your search."
                  : "No customers in your territory yet."
              }
            />
          )}
        </ScrollView>
      </View>
      <WebNavigation currentPath="/customers" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: '#111827',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  filtersContent: {
    paddingRight: 32,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  alertContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  alertSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#92400E',
  },
  content: {
    flex: 1,
  },
  customersList: {
    paddingBottom: 20,
  },
  customerCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastOrder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastOrderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2563EB',
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#374151',
  },
});

export default function CustomersPage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <CustomersScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 