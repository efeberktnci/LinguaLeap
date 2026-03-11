import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, UI } from '../theme/colors';
import { useLanguage, useUser } from '../hooks';
import AppSymbol from '../components/AppSymbol';
import { BATTLE_PASS_PRICE_LABEL, getBattlePassRewardPreview, getBattlePassTrack } from '../data/learningContent';

const ShopScreen: React.FC = () => {
  const { user, spendGems, refillHearts, claimBattlePassReward, unlockBattlePassPremium } = useUser();
  const [showPremium, setShowPremium] = useState(false);
  const { t, tx } = useLanguage();

  if (!user) return null;

  const battlePassTrack = useMemo(
    () => getBattlePassTrack(user.battlePass.level, user.battlePass.claimedRewardIds, user.battlePass.premiumUnlocked, 12),
    [user.battlePass]
  );

  const nextBattlePassReward = getBattlePassRewardPreview(user.battlePass.level);
  const nextClaimableReward = battlePassTrack.find((item) => item.claimable && !item.claimed && (!item.premium || user.battlePass.premiumUnlocked));

  const handleRefillHearts = () => {
    if (user.hearts >= user.maxHearts) {
      Alert.alert(tx('Canlarin dolu!'), tx('Canlarin dolu!'));
      return;
    }

    if (user.gems < 350) {
      Alert.alert(tx('Yetersiz Elmas'), tx('Can doldurmak icin 350 elmas gerekli.'));
      return;
    }

    Alert.alert(tx('Can Doldur'), tx('350 gem harcayarak canlarini doldurmak ister misin?'), [
      { text: tx('Vazgec'), style: 'cancel' },
      {
        text: tx('Doldur'),
        onPress: async () => {
          await refillHearts();
          Alert.alert(tx('Tamamlandi'), tx('Canlarin dolduruldu!'));
        },
      },
    ]);
  };

  const handleBuyItem = async (name: string, price: number) => {
    if (price === 0) {
      Alert.alert(tx('Basla!'), `${name} ${tx('acildi!')}`);
      return;
    }

    if (user.gems < price) {
      Alert.alert(tx('Yetersiz Elmas'), `${tx('Bu oge icin')} ${price} ${tx('elmas gerekli.')}`);
      return;
    }

    Alert.alert(tx('Satin Al'), `${name} ${tx('icin')} ${price} ${tx('harcamak ister misin?')}`, [
      { text: tx('Vazgec'), style: 'cancel' },
      {
        text: tx('Satin Al'),
        onPress: async () => {
          const success = await spendGems(price);
          if (success) Alert.alert(tx('Tebrikler!'), `${name} ${tx('satin alindi!')}`);
          else Alert.alert(tx('Hata'), tx('Bir sorun olustu.'));
        },
      },
    ]);
  };

  const handleUnlockBattlePass = async () => {
    if (user.battlePass.premiumUnlocked) {
      Alert.alert(tx('Battle Pass aktif'), tx('Premium odul hatti zaten acik.'));
      return;
    }

    Alert.alert(tx('Battle Pass Al'), `${BATTLE_PASS_PRICE_LABEL} ${tx('fiyatla premium odul hattini acmak istiyor musun?')}`, [
      { text: tx('Vazgec'), style: 'cancel' },
      {
        text: tx('Ac'),
        onPress: async () => {
          await unlockBattlePassPremium?.();
          Alert.alert(tx('Battle Pass Aktif'), tx('Premium odul hatti acildi.'));
        },
      },
    ]);
  };

  const handleClaimBattlePassReward = async (rewardId: string, gems: number) => {
    await claimBattlePassReward?.(rewardId, gems);
    Alert.alert(tx('Odul alindi'), `+${gems} ${tx('gem hesabina eklendi.')}`);
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('shop.title')}</Text>
        <View style={styles.gemsBadge}>
          <AppSymbol symbol="💎" size={16} color={COLORS.blue} />
          <Text style={styles.gemsCount}>{user.gems}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.battlePassHero}>
            <View style={styles.battlePassHeroTop}>
              <View>
                <Text style={styles.battlePassEyebrow}>BATTLE PASS</Text>
                <Text style={styles.battlePassTitle}>{user.battlePass.seasonName}</Text>
                <Text style={styles.battlePassSubtitle}>{tx('Seviye')} {user.battlePass.level} • {tx('Sonraki odul')}: {nextBattlePassReward.title}</Text>
              </View>
              <View style={styles.battlePassStateBadge}>
                <Text style={styles.battlePassStateText}>{user.battlePass.premiumUnlocked ? tx('Premium Acik') : BATTLE_PASS_PRICE_LABEL}</Text>
              </View>
            </View>

            <View style={styles.battlePassActions}>
              <TouchableOpacity style={styles.battlePassPrimaryButton} onPress={handleUnlockBattlePass}>
                <Text style={styles.battlePassPrimaryButtonText}>{user.battlePass.premiumUnlocked ? tx('PREMIUM AKTIF') : tx('BATTLE PASS AL')}</Text>
              </TouchableOpacity>
              {nextClaimableReward && (
                <TouchableOpacity
                  style={styles.battlePassSecondaryButton}
                  onPress={() => handleClaimBattlePassReward(nextClaimableReward.rewardId, nextClaimableReward.gems)}
                >
                  <Text style={styles.battlePassSecondaryButtonText}>{tx('ODUL AL')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>{tx('Battle Pass Odulleri')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.battlePassTrack}>
            {battlePassTrack.map((reward) => {
              const lockedPremium = reward.premium && !user.battlePass.premiumUnlocked;
              const available = reward.claimable && !reward.claimed && !lockedPremium;
              return (
                <View
                  key={reward.rewardId}
                  style={[
                    styles.rewardCard,
                    reward.premium && styles.rewardCardPremium,
                    reward.claimed && styles.rewardCardClaimed,
                    available && styles.rewardCardAvailable,
                  ]}
                >
                  <View style={styles.rewardCardTop}>
                    <Text style={styles.rewardLevel}>LVL {reward.level}</Text>
                    <Text style={[styles.rewardLane, reward.premium && styles.rewardLanePremium]}>
                      {reward.premium ? tx('Premium') : tx('Free')}
                    </Text>
                  </View>
                  <View style={styles.rewardIconWrap}>
                    <AppSymbol symbol={reward.icon} size={24} color={reward.premium ? COLORS.accentDark : COLORS.blueDark} />
                  </View>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardSubtitle}>{reward.subtitle}</Text>
                  <Text style={styles.rewardGemText}>+{reward.gems} gem</Text>
                  <Text style={styles.rewardPriceText}>
                    {reward.claimed ? tx('Alindi') : lockedPremium ? reward.priceLabel : reward.claimable ? tx('Hazir') : `${tx('Seviye')} ${reward.level}`}
                  </Text>
                  {available && (
                    <TouchableOpacity style={styles.rewardClaimButton} onPress={() => handleClaimBattlePassReward(reward.rewardId, reward.gems)}>
                      <Text style={styles.rewardClaimButtonText}>{tx('AL')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.heartsTitleWrap}><AppSymbol symbol="❤️" size={18} color={COLORS.red} /><Text style={styles.sectionTitle}>{tx('Canlar')}</Text></View>
            <View style={styles.heartStatus}>
              <Text style={styles.heartStatusText}>{user.hearts}/{user.maxHearts}</Text>
            </View>
          </View>

          <View style={styles.heartsCard}>
            <View style={styles.heartsRow}>
              {Array.from({ length: user.maxHearts }).map((_, i) => (
                <AppSymbol
                  key={i}
                  symbol={i < user.hearts ? '❤️' : '♡'}
                  size={28}
                  color={i < user.hearts ? COLORS.red : COLORS.hare}
                />
              ))}
            </View>

            {user.hearts < user.maxHearts ? (
              <TouchableOpacity style={styles.refillButton} onPress={handleRefillHearts}>
                <Text style={styles.refillButtonText}>{tx('Doldur')}</Text>
                <View style={styles.priceTag}>
                  <AppSymbol symbol="💎" size={12} color={COLORS.white} />
                  <Text style={styles.priceText}>350</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.fullHeartsTag}>
                <AppSymbol symbol="✓" size={18} color={COLORS.primary} />
                <Text style={styles.fullHeartsText}>{tx('Canlarin dolu!')}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.shopTitleRow}>
            <AppSymbol symbol="⚡" size={22} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>{t('shop.boosters')}</Text>
          </View>

          <View style={styles.shopGrid}>
            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem(tx('Streak Dondur'), 200)}>
              <View style={styles.shopCardIconBg}><AppSymbol symbol="🛡️" size={28} color={COLORS.red} /></View>
              <Text style={styles.shopCardName}>{tx('Streak Dondur')}</Text>
              <Text style={styles.shopCardDesc}>{tx('Serini 1 gun koru')}</Text>
              <View style={styles.gemPrice}><AppSymbol symbol="💎" size={14} color={COLORS.blue} /><Text style={styles.gemPriceText}>200</Text></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem('2x XP Boost', 100)}>
              <View style={styles.shopCardIconBg}><AppSymbol symbol="⚡" size={28} color={COLORS.accent} /></View>
              <Text style={styles.shopCardName}>2x XP Boost</Text>
              <Text style={styles.shopCardDesc}>{tx('15 dakika 2x XP kazan')}</Text>
              <View style={styles.gemPrice}><AppSymbol symbol="💎" size={14} color={COLORS.blue} /><Text style={styles.gemPriceText}>100</Text></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem(tx('Meydan Okuma'), 0)}>
              <View style={styles.shopCardIconBg}><AppSymbol symbol="⏱️" size={28} color={COLORS.eel} /></View>
              <Text style={styles.shopCardName}>{tx('Meydan Okuma')}</Text>
              <Text style={styles.shopCardDesc}>{tx('2 dakikada XP topla')}</Text>
              <View style={styles.freeTag}><Text style={styles.freeTagText}>{tx('UCRETSIZ')}</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.premiumCard} onPress={() => setShowPremium(true)} activeOpacity={0.9}>
          <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>{tx('SUPER')}</Text></View>
          <Text style={styles.premiumTitle}>LinguaLeap Super</Text>
          <Text style={styles.premiumDesc}>{tx('Sinirsiz can, reklamsiz deneyim ve ozel dersler.')}</Text>
          <TouchableOpacity style={styles.premiumButton} onPress={() => setShowPremium(true)}>
            <Text style={styles.premiumButtonText}>{tx('14 GUN UCRETSIZ DENE')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={showPremium} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.premiumModalContent}>
            <View style={styles.premiumModalHeader}>
              <Text style={styles.premiumModalTitle}>LinguaLeap Super</Text>
              <Text style={styles.premiumModalSub}>{tx('Ogrenme deneyimini bir ust seviyeye tasi')}</Text>
            </View>

            <View style={styles.premiumFeaturesList}>
              {[
                { icon: 'heart', title: tx('Sinirsiz Can'), desc: tx('Hata yapma korkusu olmadan ogren') },
                { icon: 'ban', title: tx('Reklamsiz'), desc: tx('Kesintisiz ogrenme deneyimi') },
                { icon: 'book', title: tx('Ozel Dersler'), desc: tx('Sadece Super uyelere ozel icerikler') },
                { icon: 'flash', title: '2x XP', desc: tx('Her dersten 2 kat XP kazan') },
                { icon: 'shield-half', title: tx('Streak Korumasi'), desc: tx('Aylik 2 ucretsiz streak dondurma') },
                { icon: 'checkmark-done', title: tx('Hatasiz Pratik'), desc: tx('Sinirsiz pratik modu') },
              ].map((f, i) => (
                <View key={i} style={styles.premiumFeatureItem}>
                  <Ionicons name={f.icon as any} size={26} color={COLORS.eel} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumFeatureTitle}>{f.title}</Text>
                    <Text style={styles.premiumFeatureDesc}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.premiumCTA}
              onPress={() => {
                setShowPremium(false);
                Alert.alert(tx('Tesekkurler!'), tx('14 gunluk deneme sureniz basladi. (Demo)'));
              }}
            >
              <Text style={styles.premiumCTAText}>{tx('14 GUN UCRETSIZ BASLA')}</Text>
              <Text style={styles.premiumCTASub}>{tx('Sonra aylik 79.99')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.premiumSkip} onPress={() => setShowPremium(false)}>
              <Text style={styles.premiumSkipText}>{tx('Simdilik gec')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgCanvas },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: COLORS.bgCanvas },
  headerTitle: { fontSize: 20, color: COLORS.ink, ...FONTS.bold },
  gemsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgPanelAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: UI.radius.pill, gap: 4, borderWidth: 1, borderColor: COLORS.skyLine },
  gemsCount: { fontSize: 15, color: COLORS.blue, ...FONTS.bold },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24 },
  battlePassHero: { backgroundColor: '#14212C', borderRadius: UI.radius.lg, padding: 20, marginBottom: 14, ...SHADOWS.medium },
  battlePassHeroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  battlePassEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.6)', ...FONTS.bold, letterSpacing: 1.4 },
  battlePassTitle: { fontSize: 24, color: COLORS.white, ...FONTS.bold, marginTop: 4 },
  battlePassSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 6, maxWidth: 220 },
  battlePassStateBadge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: UI.radius.pill, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  battlePassStateText: { fontSize: 11, color: COLORS.white, ...FONTS.bold },
  battlePassActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  battlePassPrimaryButton: { flex: 1, backgroundColor: COLORS.accent, borderRadius: UI.radius.md, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.accentDark },
  battlePassPrimaryButtonText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  battlePassSecondaryButton: { minWidth: 110, backgroundColor: COLORS.blue, borderRadius: UI.radius.md, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.blueDark, paddingHorizontal: 14 },
  battlePassSecondaryButtonText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  battlePassTrack: { paddingRight: 16, gap: 12 },
  rewardCard: { width: 188, backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.lg, padding: 16, borderWidth: 1, borderColor: COLORS.mintLine },
  rewardCardPremium: { backgroundColor: COLORS.accentSoft, borderColor: '#F4D6A2' },
  rewardCardClaimed: { opacity: 0.62 },
  rewardCardAvailable: { borderColor: COLORS.primary, shadowColor: COLORS.primaryDark, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  rewardCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rewardLevel: { fontSize: 11, color: COLORS.inkSoft, ...FONTS.bold, letterSpacing: 0.9 },
  rewardLane: { fontSize: 11, color: COLORS.blueDark, ...FONTS.bold, backgroundColor: COLORS.bgPanelAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: UI.radius.pill },
  rewardLanePremium: { color: COLORS.accentDark, backgroundColor: '#FFE2B6' },
  rewardIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  rewardTitle: { fontSize: 17, color: COLORS.ink, ...FONTS.bold, marginTop: 14 },
  rewardSubtitle: { fontSize: 12, color: COLORS.inkSoft, marginTop: 6, lineHeight: 18, minHeight: 36 },
  rewardGemText: { fontSize: 15, color: COLORS.blueDark, ...FONTS.bold, marginTop: 12 },
  rewardPriceText: { fontSize: 11, color: COLORS.inkSoft, ...FONTS.medium, marginTop: 6 },
  rewardClaimButton: { marginTop: 12, backgroundColor: COLORS.primary, borderRadius: UI.radius.md, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark },
  rewardClaimButtonText: { fontSize: 12, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: COLORS.ink, ...FONTS.bold, marginBottom: 12 },
  shopTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  heartsTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heartStatus: { backgroundColor: '#FFECEC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  heartStatusText: { fontSize: 13, color: COLORS.red, ...FONTS.bold },
  heartsCard: { backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.mintLine, ...SHADOWS.small },
  heartsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  refillButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.red, paddingHorizontal: 24, paddingVertical: 12, borderRadius: UI.radius.md, gap: 10, borderBottomWidth: 4, borderBottomColor: COLORS.redDark },
  refillButtonText: { fontSize: 15, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  priceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 3 },
  priceText: { fontSize: 13, color: COLORS.white, ...FONTS.bold },
  fullHeartsTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fullHeartsText: { fontSize: 14, color: COLORS.primary, ...FONTS.semiBold },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shopCard: { width: '48%', backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.md, padding: 16, borderWidth: 1, borderColor: COLORS.mintLine, alignItems: 'center', flexGrow: 1 },
  shopCardIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.bgCanvas, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  shopCardName: { fontSize: 15, color: COLORS.ink, ...FONTS.bold, textAlign: 'center' },
  shopCardDesc: { fontSize: 12, color: COLORS.inkSoft, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  gemPrice: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgPanelAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 4, borderWidth: 1, borderColor: COLORS.skyLine },
  gemPriceText: { fontSize: 14, color: COLORS.blue, ...FONTS.bold },
  freeTag: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  freeTagText: { fontSize: 12, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  premiumCard: { backgroundColor: '#14212C', borderRadius: UI.radius.lg, padding: 24, alignItems: 'center', ...SHADOWS.medium },
  premiumBadge: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  premiumBadgeText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 2 },
  premiumTitle: { fontSize: 24, color: COLORS.white, ...FONTS.bold, marginBottom: 8 },
  premiumDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 20 },
  premiumButton: { backgroundColor: COLORS.accent, paddingHorizontal: 32, paddingVertical: 16, borderRadius: UI.radius.md, borderBottomWidth: 4, borderBottomColor: '#CC7A00', width: '100%', alignItems: 'center' },
  premiumButtonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  premiumModalContent: { backgroundColor: COLORS.bgPanel, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '90%' },
  premiumModalHeader: { alignItems: 'center', marginBottom: 24 },
  premiumModalTitle: { fontSize: 26, color: COLORS.ink, ...FONTS.bold },
  premiumModalSub: { fontSize: 14, color: COLORS.inkSoft, marginTop: 4, textAlign: 'center' },
  premiumFeaturesList: { gap: 16, marginBottom: 24 },
  premiumFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  premiumFeatureTitle: { fontSize: 15, color: COLORS.ink, ...FONTS.bold },
  premiumFeatureDesc: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  premiumCTA: { backgroundColor: COLORS.accent, borderRadius: UI.radius.md, padding: 18, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#CC7A00' },
  premiumCTAText: { fontSize: 17, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  premiumCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  premiumSkip: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  premiumSkipText: { fontSize: 15, color: COLORS.wolf, ...FONTS.medium },
});
