import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Phone, Mail, User as User2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

interface ContactInfoProps {
  contact: Contact;
}

export function ContactInfo({ contact }: ContactInfoProps) {
  const { colors } = useTheme();

  const handlePhonePress = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contact.email}`);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <User2 size={20} color={colors.textSecondary} />
        <Text style={styles.cardTitle}>Contact Information</Text>
      </View>

      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactRole}>{contact.role}</Text>

        <TouchableOpacity 
          style={styles.contactItem} 
          onPress={handlePhonePress}
        >
          <Phone size={18} color={colors.textSecondary} />
          <Text style={styles.contactText}>{contact.phone}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactItem} 
          onPress={handleEmailPress}
        >
          <Mail size={18} color={colors.textSecondary} />
          <Text style={styles.contactText}>{contact.email}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  contactDetails: {
    gap: 12,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#111827',
  },
  contactRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#374151',
  },
});