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

      <View style={leadStyles.nextAction}>
        <Text style={leadStyles.nextActionLabel}>Next Action:</Text>
        <Text style={leadStyles.actionText}>{nextAction}</Text>
      </View>
    </TouchableOpacity>
  );
}