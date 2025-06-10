import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface ProductOption {
  id: string;
  name: string;
  matchPercentage: number;
  defaultPrice: string;
  retailPrice: string;
  yourPrice: string;
  avgMargin: string;
}

interface ProductSelectorProps {
  selectedProduct: ProductOption;
  alternatives?: ProductOption[];
  onProductChange: (product: ProductOption) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProduct,
  alternatives = [],
  onProductChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Filter out the selected product from alternatives to avoid duplicates
  const filteredAlternatives = React.useMemo(() => {
    return alternatives.filter(alt => alt.id !== selectedProduct.id);
  }, [alternatives, selectedProduct.id]);
  
  // Create options array: selected product first, then filtered alternatives
  const allOptions = React.useMemo(() => {
    return [selectedProduct, ...filteredAlternatives];
  }, [selectedProduct, filteredAlternatives]);
  
  const hasAlternatives = filteredAlternatives.length > 0;

  const handleSelectProduct = (product: ProductOption) => {
    onProductChange(product);
    setIsDropdownOpen(false);
  };

  const renderProductOption = ({ item }: { item: ProductOption }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        item.id === selectedProduct.id && styles.selectedDropdownItem
      ]}
      onPress={() => handleSelectProduct(item)}
    >
      <View style={styles.dropdownItemContent}>
        <View style={styles.dropdownItemHeader}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchPercentage}>{item.matchPercentage}% Match</Text>
          </View>
          {item.id === selectedProduct.id && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedText}>Current</Text>
            </View>
          )}
        </View>
        <Text style={styles.dropdownItemName}>{item.name}</Text>
        <View style={styles.dropdownPriceRow}>
          <Text style={styles.dropdownPriceLabel}>Your Price: </Text>
          <Text style={styles.dropdownPriceValue}>{item.yourPrice}</Text>
          <Text style={styles.dropdownMarginValue}> • {item.avgMargin}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, !hasAlternatives && styles.disabledSelector]}
        onPress={() => hasAlternatives && setIsDropdownOpen(true)}
        disabled={!hasAlternatives}
      >
        <View style={styles.selectorContent}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchPercentage}>{selectedProduct.matchPercentage}% Match</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{selectedProduct.name}</Text>
            {hasAlternatives && (
              <Text style={styles.alternativesCount}>
                +{filteredAlternatives.length} alternative{filteredAlternatives.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
          {hasAlternatives && (
            <ChevronDown size={16} color="#6B7280" style={styles.chevron} />
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setIsDropdownOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={allOptions}
              renderItem={renderProductOption}
              keyExtractor={(item) => item.id}
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  selector: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disabledSelector: {
    opacity: 0.7,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchBadge: {
    backgroundColor: '#C6E1D5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  matchPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#09352A',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  alternativesCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  chevron: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 400,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 18,
    color: '#6B7280',
    padding: 4,
  },
  dropdownList: {
    maxHeight: 400,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedDropdownItem: {
    backgroundColor: '#F0F9FF',
  },
  dropdownItemContent: {
    flex: 1,
  },
  dropdownItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectedIndicator: {
    backgroundColor: '#0369A1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  selectedText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  dropdownItemName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 4,
  },
  dropdownPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownPriceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  dropdownPriceValue: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  dropdownMarginValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
}); 