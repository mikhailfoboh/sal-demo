import { StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';

export const planStyles = StyleSheet.create({
  // PlanScreen styles
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#087057',
  },
  titleRow: {
    marginBottom: spacing.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#087057',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.body1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  statIconContainer: {
    zIndex: 1000,
    position: 'absolute',
    bottom: -15, // Half outside the card
    left: '50%',
    marginLeft: -15, // Half of width to center it
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingIconContainer: {
    backgroundColor: '#FF710B', // Yellow/Gold background
  },
  completedIconContainer: {
    backgroundColor: '#2B752B', // Light green background
  },
  weekIconContainer: {
    backgroundColor: '#393939', // Light gray background
  },
  pendingCard: {
    backgroundColor: '#FDEFE2', // Orange background
    borderColor: '#393939',
  },
  completedCard: {
    backgroundColor: '#E2FCE8', // Green background
    borderColor: '#393939',
  },
  weekCard: {
    backgroundColor: '#F3F4F6', // Light gray background
    borderColor: '#393939',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  statValueWhite: {
    color: '#FFFFFF',
  },
  statLabel: {
    ...typography.caption,
    paddingBottom: 4,
  },
  statLabelWhite: {
    color: '#FFFFFF',
  },
  statLabelGreen: {
    color: '#2B752B',
    paddingBottom: 4,
  },
  statLabelGray: {
    color: '#393939',
    paddingBottom: 4,
  },
  statLabelOrange: {
    color: '#FF710B',
    paddingBottom: 4,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    ...layout.shadow.md,
  },

  // PriorityAlert styles
  priorityAlert: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#FDEFE2',
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: '#393939',
    overflow: 'hidden',
  },
  priorityContent: {
    padding: spacing.md,
  },
  priorityIconContainer: {
    marginBottom: spacing.sm,
  },
  priorityTextContainer: {
    marginBottom: spacing.md,
  },
  priorityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#553402',
    marginBottom: spacing.xs,
  },
  priorityMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#393939',
  },
  priorityButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#996623',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.sm,
  },
  priorityButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FDEFE2',
    marginRight: spacing.xs,
  },

  // DailyPlanView styles
  dailyPlanContainer: {
    flex: 1,
  },
  dailyPlanContent: {
    paddingBottom: spacing.xxl,
  },
  timeBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  blockTitle: {
    ...typography.small,
    marginBottom: spacing.sm,
  },
  itemContainer: {
    marginBottom: spacing.sm,
  },
  itemCard: {
    padding: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priorityTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.full,
  },
  priorityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  completeButton: {
    padding: spacing.xs,
  },
  itemContent: {
    opacity: 1,
  },
  itemTitle: {
    ...typography.body2,
    fontFamily: 'Inter-Medium',
    marginBottom: spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  description: {
    ...typography.caption,
  },
  completedText: {
    color: colors.textTertiary,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },

  // WeekSelector styles
  weekSelectorContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: spacing.xs,
  },
  weekText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  dateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '13%',
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: '#F0F7F4',
    borderWidth: 1,
    borderColor: '#C6E1D5',
  },
  dateButtonSelected: {
    backgroundColor: '#087057',
    borderColor: '#2E5247',
  },
  pastDate: {
    opacity: 0.5,
  },
  dayText: {
    ...typography.caption,
    marginBottom: spacing.xs,
    color: '#393939',
  },
  dateText: {
    ...typography.body2,
    fontFamily: 'Inter-SemiBold',
    color: '#393939',
  },
  selectedText: {
    color: '#F8FCFA',
  },
  pastText: {
    color: colors.textTertiary,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
}); 