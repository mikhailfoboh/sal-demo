import { StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';

// Add new colors for lead status tags
const statusColors = {
  new: {
    background: '#E8F5E9',
    text: '#1B873F'
  },
  contacted: {
    background: '#EEF2FF',
    text: '#4F46E5'
  },
  sampling: {
    background: '#FFF7ED',
    text: '#EA580C'
  },
  won: {
    background: '#E8F5E9',
    text: '#1B873F'
  }
};

export const leadStyles = StyleSheet.create({
  // Screen Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  
  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: spacing.md,
    marginTop: -30,
    backgroundColor: '#F0F7F4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6E1D5',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    overflow: 'hidden',
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: '#C6E1D5',
    borderColor: '#638174',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#09352A',
  },
  filterTextActive: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#09352A',
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Lead Card
  card: {
    backgroundColor: '#F0F7F4',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#658F81',
    ...layout.shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  businessName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statusTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
  },
  statusTagNew: {
    backgroundColor: statusColors.new.background,
    borderColor: statusColors.new.text,
  },
  statusTagContacted: {
    backgroundColor: statusColors.contacted.background,
    borderColor: statusColors.contacted.text,
  },
  statusTagSampling: {
    backgroundColor: statusColors.sampling.background,
    borderColor: statusColors.sampling.text,
  },
  statusTagWon: {
    backgroundColor: statusColors.won.background,
    borderColor: statusColors.won.text,
  },
  statusText: {
    ...typography.small,
    fontFamily: 'Inter-Medium',
  },
  statusTextNew: {
    color: statusColors.new.text,
  },
  statusTextContacted: {
    color: statusColors.contacted.text,
  },
  statusTextSampling: {
    color: statusColors.sampling.text,
  },
  statusTextWon: {
    color: statusColors.won.text,
  },

  // Business Info
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  infoDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  reviewCount: {
    ...typography.body2,
    color: colors.textTertiary,
  },

  // Next Action
  nextAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nextActionLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  actionText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.xs,
  },

  // CTA Button
  ctaButton: {
    backgroundColor: '#09352A',
    borderColor: '#09352A',
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  ctaButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },

  // Secondary Button (Ghosted)
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: '#09352A',
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#09352A',
  },

  // Additional Data Sections
  additionalData: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  dataSection: {
    marginBottom: spacing.sm,
  },
  dataLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#5E5E5E',
    marginBottom: 2,
  },
  dataValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },

  // Search Bar
  searchContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
  searchInput: {
    backgroundColor: '#F0F7F4',
    borderColor: '#638174',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body1,
    color: colors.textPrimary,
    ...layout.shadow.sm,
  },
}); 