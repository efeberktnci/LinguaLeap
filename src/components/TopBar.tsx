import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, UI } from '../theme/colors';
import { useUser, useLanguage } from '../hooks';
import AppSymbol from './AppSymbol';

const TopBar: React.FC<{ showLanguage?: boolean; compact?: boolean }> = ({ showLanguage = true, compact = false }) => {
  const { user } = useUser();
  const { t, options, language, setLanguage, activeFlag } = useLanguage();
  const [open, setOpen] = useState(false);

  const onSelect = async (code: (typeof options)[number]['code']) => {
    await setLanguage(code);
    setOpen(false);
  };

  return (
    <View style={styles.outer}>
      <View style={[styles.container, compact && styles.containerCompact]}>
        {showLanguage ? (
          <TouchableOpacity style={[styles.langButton, compact && styles.langButtonCompact]} activeOpacity={0.85} onPress={() => setOpen(true)}>
            <AppSymbol symbol={activeFlag} size={compact ? 18 : 22} color={COLORS.blueDark} style={[styles.flag, compact && styles.flagCompact]} />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statPill, styles.statPillWarm, compact && styles.statPillCompact]} activeOpacity={0.85}>
            <Ionicons name="flame" size={compact ? 14 : 16} color={COLORS.accent} />
            <Text style={[styles.statValue, compact && styles.statValueCompact, { color: COLORS.accent }]}>{user?.streak ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statPill, styles.statPillCool, compact && styles.statPillCompact]} activeOpacity={0.85}>
            <Ionicons name="diamond" size={compact ? 14 : 16} color={COLORS.blue} />
            <Text style={[styles.statValue, compact && styles.statValueCompact, { color: COLORS.blue }]}>{user?.gems ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statPill, styles.statPillHeart, compact && styles.statPillCompact]} activeOpacity={0.85}>
            <Ionicons name="heart" size={compact ? 14 : 16} color={COLORS.red} />
            <Text style={[styles.statValue, compact && styles.statValueCompact, { color: COLORS.red }]}>{user?.hearts ?? 0}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('language.title')}</Text>
            {options.map((opt) => (
              <TouchableOpacity key={opt.code} style={[styles.optionRow, opt.code === language && styles.optionRowActive]} onPress={() => onSelect(opt.code)}>
                <AppSymbol symbol={opt.flag} size={18} color={COLORS.blueDark} style={styles.optionFlag} />
                <Text style={styles.optionLabel}>{opt.label}</Text>
                {opt.code === language && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  outer: {
    backgroundColor: COLORS.bgCanvas,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 48 : 30,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginTop: 6,
    borderRadius: UI.radius.lg,
    backgroundColor: COLORS.bgPanel,
    borderWidth: UI.stroke.soft,
    borderColor: COLORS.mintLine,
    ...SHADOWS.small,
  },
  containerCompact: {
    paddingTop: Platform.OS === 'ios' ? 42 : 24,
    paddingBottom: 8,
    marginTop: 2,
  },
  langButton: {
    minWidth: 42,
    height: 34,
    borderRadius: UI.radius.md,
    borderWidth: 1,
    borderColor: COLORS.skyLine,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgPanelAlt,
  },
  langButtonCompact: {
    minWidth: 36,
    height: 30,
  },
  flag: {
    fontSize: 19,
  },
  flagCompact: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statPill: {
    minWidth: 60,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: UI.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statPillCompact: {
    minWidth: 54,
    height: 30,
    paddingHorizontal: 8,
  },
  statPillWarm: {
    backgroundColor: COLORS.accentSoft,
    borderColor: '#F6D19B',
  },
  statPillCool: {
    backgroundColor: COLORS.bgPanelAlt,
    borderColor: COLORS.skyLine,
  },
  statPillHeart: {
    backgroundColor: '#FFF1F1',
    borderColor: '#FFD8D8',
  },
  statValue: {
    fontSize: 14,
    ...FONTS.bold,
  },
  statValueCompact: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 108 : 86,
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: COLORS.bgPanel,
    borderRadius: UI.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
    ...SHADOWS.small,
  },
  modalTitle: {
    fontSize: 14,
    ...FONTS.bold,
    color: COLORS.eel,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  optionRowActive: {
    backgroundColor: COLORS.primarySoft,
  },
  optionFlag: {
    fontSize: 18,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.eel,
    ...FONTS.medium,
  },
});
