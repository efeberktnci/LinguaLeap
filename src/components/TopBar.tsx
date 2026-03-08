import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';
import { useUser, useLanguage } from '../hooks';

const TopBar: React.FC<{ showLanguage?: boolean }> = ({ showLanguage = true }) => {
  const { user } = useUser();
  const { t, options, language, setLanguage, activeFlag } = useLanguage();
  const [open, setOpen] = useState(false);

  const onSelect = async (code: (typeof options)[number]['code']) => {
    await setLanguage(code);
    setOpen(false);
  };

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        {showLanguage ? (
          <TouchableOpacity style={styles.langButton} activeOpacity={0.85} onPress={() => setOpen(true)}>
            <Text style={styles.flag}>{activeFlag}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statPill} activeOpacity={0.85}>
            <Ionicons name="flame" size={16} color={COLORS.accent} />
            <Text style={[styles.statValue, { color: COLORS.accent }]}>{user?.streak ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statPill} activeOpacity={0.85}>
            <Ionicons name="diamond" size={16} color={COLORS.blue} />
            <Text style={[styles.statValue, { color: COLORS.blue }]}>{user?.gems ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statPill} activeOpacity={0.85}>
            <Ionicons name="heart" size={16} color={COLORS.red} />
            <Text style={[styles.statValue, { color: COLORS.red }]}>{user?.hearts ?? 0}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('language.title')}</Text>
            {options.map((opt) => (
              <TouchableOpacity key={opt.code} style={[styles.optionRow, opt.code === language && styles.optionRowActive]} onPress={() => onSelect(opt.code)}>
                <Text style={styles.optionFlag}>{opt.flag}</Text>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
  },
  langButton: {
    minWidth: 48,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.swan,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  flag: {
    fontSize: 22,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statPill: {
    minWidth: 72,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.snow,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    ...FONTS.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 108 : 86,
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.swan,
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
    backgroundColor: COLORS.primaryBg,
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
