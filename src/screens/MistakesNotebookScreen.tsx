import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import { useLanguage, useUser } from '../hooks';
import { COLORS, FONTS, SHADOWS, UI } from '../theme/colors';
import AppSymbol from '../components/AppSymbol';

type Props = NativeStackScreenProps<RootStackParamList, 'MistakesNotebook'>;

const MistakesNotebookScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
  const { tx } = useLanguage();

  const entries = useMemo(
    () =>
      Object.values(user?.mistakeBuckets ?? {})
        .sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct))
        .map((item) => ({
          ...item,
          score: Math.max(0, item.wrong - item.correct),
          status:
            item.wrong - item.correct >= 4 ? tx('Kritik') :
            item.wrong - item.correct >= 2 ? tx('Tekrar Gerekli') :
            tx('Kontrol Altinda'),
        })),
    [tx, user?.mistakeBuckets]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tx('Mistakes Notebook')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppSymbol symbol="🧠" size={22} color={COLORS.blueDark} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>{tx('Zorlandigin Kelimeler')}</Text>
            <Text style={styles.heroText}>{tx('Burada hata yaptigin kelimeleri gorur, review modunda tekrar calisirsin.')}</Text>
          </View>
        </View>

        {entries.length === 0 ? (
          <View style={styles.emptyCard}>
            <AppSymbol symbol="✨" size={22} color={COLORS.primaryDark} />
            <Text style={styles.emptyTitle}>{tx('Henuz not alinmadi')}</Text>
            <Text style={styles.emptyText}>{tx('Biraz daha ders cozdükce zorlandigin kelimeler burada birikecek.')}</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.focus} style={styles.entryCard}>
              <View style={styles.entryTop}>
                <Text style={styles.entryWord}>{entry.focus}</Text>
                <View style={styles.entryBadge}>
                  <Text style={styles.entryBadgeText}>{entry.status}</Text>
                </View>
              </View>
              <Text style={styles.entryMeta}>
                {tx('Yanlis')} {entry.wrong} • {tx('Dogru')} {entry.correct} • {tx('Fark')} {entry.score}
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.learnButton} onPress={() => navigation.goBack()}>
          <Text style={styles.learnButtonText}>{tx('Learn E Don')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MistakesNotebookScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgCanvas },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgPanel,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
  },
  headerTitle: { fontSize: 20, color: COLORS.ink, ...FONTS.bold },
  headerSpacer: { width: 36 },
  scrollContent: { padding: 16, paddingTop: 4, paddingBottom: 28 },
  heroCard: {
    backgroundColor: COLORS.bgPanel,
    borderRadius: UI.radius.lg,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgPanelAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1 },
  heroTitle: { fontSize: 16, color: COLORS.ink, ...FONTS.bold },
  heroText: { fontSize: 13, color: COLORS.inkSoft, marginTop: 4, lineHeight: 18 },
  emptyCard: {
    marginTop: 16,
    backgroundColor: COLORS.primarySoft,
    borderRadius: UI.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, color: COLORS.primaryDark, ...FONTS.bold, marginTop: 8 },
  emptyText: { fontSize: 13, color: COLORS.inkSoft, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  entryCard: {
    marginTop: 12,
    backgroundColor: COLORS.bgPanel,
    borderRadius: UI.radius.md,
    borderWidth: 1,
    borderColor: COLORS.mintLine,
    padding: 14,
  },
  entryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  entryWord: { fontSize: 18, color: COLORS.ink, ...FONTS.bold },
  entryBadge: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: UI.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  entryBadgeText: { fontSize: 11, color: COLORS.accentDark, ...FONTS.bold },
  entryMeta: { fontSize: 13, color: COLORS.inkSoft, marginTop: 8 },
  learnButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: UI.radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryDark,
  },
  learnButtonText: { fontSize: 15, color: COLORS.white, ...FONTS.bold },
});
