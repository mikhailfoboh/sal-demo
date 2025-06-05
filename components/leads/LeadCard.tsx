import { View, Text, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { leadStyles } from '@/styles/components/leads';

interface LeadCardProps {
  businessName: string;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  status: 'new' | 'contacted' | 'sampling' | 'won';
  nextAction: string;
  productMatch?: string;
  upcomingEvent?: string;
  localBuzz?: string;
  note?: string;
  reminder?: string;
  onPress: () => void;
}

export function LeadCard({
  businessName,
  location,
  category,
  rating,
  reviewCount,
  status,
  nextAction,
  productMatch,
  upcomingEvent,
  localBuzz,
  note,
  reminder,
  onPress,
}: LeadCardProps) {
  const { colors } = useTheme();

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return {
          container: leadStyles.statusTagNew,
          text: leadStyles.statusTextNew,
        };
      case 'contacted':
        return {
          container: leadStyles.statusTagContacted,
          text: leadStyles.statusTextContacted,
        };
      case 'sampling':
        return {
          container: leadStyles.statusTagSampling,
          text: leadStyles.statusTextSampling,
        };
      case 'won':
        return {
          container: leadStyles.statusTagWon,
          text: leadStyles.statusTextWon,
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  const statusStyles = getStatusStyles(status);

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <TouchableOpacity style={leadStyles.card} onPress={onPress}>
      <View style={leadStyles.cardHeader}>
        <Text style={leadStyles.businessName}>{businessName}</Text>
        <View style={[leadStyles.statusTag, statusStyles.container]}>
          <Text style={[leadStyles.statusText, statusStyles.text]}>
            {capitalizeFirstLetter(status)}
          </Text>
        </View>
      </View>

      <View style={leadStyles.businessInfo}>
        <Text style={leadStyles.infoText}>{location}</Text>
        <View style={leadStyles.infoDot} />
        <Text style={leadStyles.infoText}>{category}</Text>
        <View style={leadStyles.infoDot} />
        <View style={leadStyles.rating}>
          <Text style={leadStyles.ratingText}>{rating}</Text>
          <Star 
            size={16} 
            color={colors.warning} 
            fill={colors.warning} 
            style={{ marginLeft: 4, marginRight: 4 }} 
          />
          <Text style={leadStyles.reviewCount}>({reviewCount} reviews)</Text>
        </View>
      </View>

      {/* Additional Data Sections */}
      <View style={leadStyles.additionalData}>
        {productMatch && (
          <View style={leadStyles.dataSection}>
            <Text style={leadStyles.dataLabel}>Product match</Text>
            <Text style={leadStyles.dataValue}>{productMatch}</Text>
          </View>
        )}
        
        {upcomingEvent && (
          <View style={leadStyles.dataSection}>
            <Text style={leadStyles.dataLabel}>Upcoming Event</Text>
            <Text style={leadStyles.dataValue}>{upcomingEvent}</Text>
          </View>
        )}
        
        {localBuzz && (
          <View style={leadStyles.dataSection}>
            <Text style={leadStyles.dataLabel}>Local Buzz</Text>
            <Text style={leadStyles.dataValue}>{localBuzz}</Text>
          </View>
        )}
        
        {note && (
          <View style={leadStyles.dataSection}>
            <Text style={leadStyles.dataLabel}>Note</Text>
            <Text style={leadStyles.dataValue}>{note}</Text>
          </View>
        )}
        
        {reminder && (
          <View style={leadStyles.dataSection}>
            <Text style={leadStyles.dataLabel}>Reminder</Text>
            <Text style={leadStyles.dataValue}>{reminder}</Text>
          </View>
        )}
      </View>

      <View style={leadStyles.nextAction}>
        <TouchableOpacity style={leadStyles.ctaButton}>
          <Text style={leadStyles.ctaButtonText}>{nextAction}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={leadStyles.secondaryButton} onPress={onPress}>
          <Text style={leadStyles.secondaryButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}