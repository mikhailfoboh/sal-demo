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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.defaultTagBackground,
  },
  filterTabActive: {
    backgroundColor: colors.textPrimary,
  },
  filterText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.buttonText,
  },

  // Lead Card
  card: {
    backgroundColor: '#F0F7F4',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#C6E1D5',
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

  // Search Bar
  searchContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body1,
    color: colors.textPrimary,
    ...layout.shadow.sm,
  },
}); 