import { StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from './theme';

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Cards
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: layout.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...layout.shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardContent: {
    flex: 1,
  },

  // Typography
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.body2,
  },
  caption: {
    ...typography.caption,
  },

  // Forms
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.textPrimary,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.xs,
  },

  // Buttons
  button: {
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    ...typography.button,
    color: colors.buttonText,
  },
  buttonTextSecondary: {
    ...typography.button,
    color: colors.primary,
  },

  // Lists
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },

  // Icons
  icon: {
    width: 24,
    height: 24,
  },
  iconSmall: {
    width: 16,
    height: 16,
  },
  iconLarge: {
    width: 32,
    height: 32,
  },

  // Badges & Tags
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.defaultTagBackground,
  },
  badgeText: {
    ...typography.small,
  },

  // Utility
  mt: { marginTop: spacing.md },
  mb: { marginBottom: spacing.md },
  ml: { marginLeft: spacing.md },
  mr: { marginRight: spacing.md },
  mx: { marginHorizontal: spacing.md },
  my: { marginVertical: spacing.md },
  p: { padding: spacing.md },
  px: { paddingHorizontal: spacing.md },
  py: { paddingVertical: spacing.md },
}); 