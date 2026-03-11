import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, UI } from '../theme/colors';
import { useLanguage, useUser } from '../hooks';
import AppSymbol from '../components/AppSymbol';
import { BATTLE_PASS_PRICE_LABEL, getBattlePassRewardPreview, getBattlePassTrack } from '../data/learningContent';

const SHOP_PALETTE = {
  ink: '#1F2B28',
  line: '#D7E6DA',
  panel: '#FCFDF8',
  panelAlt: '#F3F8F2',
  mint: '#DDF1D6',
  mintStrong: '#58CC02',
  mintShadow: '#46A302',
  blueSoft: '#E9F5FF',
  blueLine: '#CFE6F5',
  blueStrong: '#1CB0F6',
  amberSoft: '#FFF1DA',
  amberLine: '#F3D7A3',
  amberStrong: '#FF9600',
  coralSoft: '#FFF0EE',
  coralLine: '#FFD6D0',
  coralStrong: '#FF6B57',
  night: '#173229',
  nightAlt: '#244638',
} as const;

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
            {/* Dekoratif arka plan efektleri */}
            <View style={styles.bpGlowTop} />
            <View style={styles.bpGlowBottom} />
            <View style={styles.bpOrb1} />
            <View style={styles.bpOrb2} />

            <View style={styles.battlePassHeroTop}>
              <View style={{ flex: 1 }}>
                <View style={styles.battlePassEyebrowRow}>
                  <View style={styles.battlePassEyebrowDot} />
                  <Text style={styles.battlePassEyebrow}>BATTLE PASS</Text>
                </View>
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
              const claimed = reward.claimed;
              const locked = !available && !claimed;
              const actionLabel = claimed ? tx('CLAIMED') : tx('CLAIM');
              const actionIcon = claimed ? '✓' : locked ? '🔒' : undefined;
              return (
                <View
                  key={reward.rewardId}
                  style={[
                    styles.rewardCard,
                    reward.premium && styles.rewardCardPremium,
                    claimed && styles.rewardCardClaimed,
                    available && styles.rewardCardAvailable,
                  ]}
                >
                  {available && <View style={[styles.rewardGlow, reward.premium && styles.rewardGlowPremium]} />}
                  {claimed && <View style={[styles.rewardClaimedGlow, reward.premium && styles.rewardClaimedGlowPremium]} />}
                  {available && (
                    <View style={[styles.rewardReadyRibbon, reward.premium && styles.rewardReadyRibbonPremium]}>
                      <AppSymbol symbol="⚡" size={11} color={COLORS.white} />
                      <Text style={styles.rewardReadyRibbonText}>{tx('Hazir')}</Text>
                    </View>
                  )}
                  {claimed && (
                    <View style={[styles.rewardClaimedRibbon, reward.premium && styles.rewardClaimedRibbonPremium]}>
                      <AppSymbol symbol="✓" size={11} color={COLORS.white} />
                      <Text style={styles.rewardClaimedRibbonText}>{tx('Kasada')}</Text>
                    </View>
                  )}
                  <View style={styles.rewardCardTop}>
                    <Text style={styles.rewardLevel}>LVL {reward.level}</Text>
                    <Text style={[styles.rewardLane, reward.premium && styles.rewardLanePremium]}>
                      {reward.premium ? tx('Premium') : tx('Free')}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.rewardIconWrap,
                      available && styles.rewardIconWrapAvailable,
                      reward.premium && available && styles.rewardIconWrapAvailablePremium,
                      claimed && styles.rewardIconWrapClaimed,
                      reward.premium && claimed && styles.rewardIconWrapClaimedPremium,
                    ]}
                  >
                    <AppSymbol symbol={reward.icon} size={24} color={reward.premium ? COLORS.accentDark : COLORS.blueDark} />
                  </View>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardSubtitle}>{reward.subtitle}</Text>
                  <Text style={styles.rewardGemText}>+{reward.gems} gem</Text>
                  <Text style={styles.rewardPriceText}>
                    {claimed ? tx('Odul envantere eklendi') : lockedPremium ? reward.priceLabel : reward.claimable ? tx('Hazir') : `${tx('Seviye')} ${reward.level}`}
                  </Text>
                  {claimed && (
                    <View style={styles.rewardClaimedFooter}>
                      <AppSymbol symbol="🎒" size={14} color={SHOP_PALETTE.mintShadow} />
                      <Text style={styles.rewardClaimedFooterText}>{tx('Odul envantere eklendi')}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.rewardClaimButton,
                      locked && styles.rewardClaimButtonLocked,
                      claimed && styles.rewardClaimButtonClaimed,
                      reward.premium && available && styles.rewardClaimButtonPremium,
                      reward.premium && claimed && styles.rewardClaimButtonClaimedPremium,
                    ]}
                    disabled={!available}
                    onPress={available ? () => handleClaimBattlePassReward(reward.rewardId, reward.gems) : undefined}
                  >
                    {actionIcon ? <AppSymbol symbol={actionIcon} size={13} color={COLORS.white} /> : null}
                    <Text style={styles.rewardClaimButtonText}>{actionLabel}</Text>
                  </TouchableOpacity>
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
  headerTitle: { fontSize: 20, color: SHOP_PALETTE.ink, ...FONTS.bold },
  gemsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: SHOP_PALETTE.blueSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: UI.radius.pill, gap: 4, borderWidth: 1, borderColor: SHOP_PALETTE.blueLine },
  gemsCount: { fontSize: 15, color: SHOP_PALETTE.blueStrong, ...FONTS.bold },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24 },
  battlePassHero: {
    backgroundColor: SHOP_PALETTE.night,
    borderRadius: UI.radius.lg,
    padding: 20,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(127,193,150,0.22)',
    shadowColor: '#244638',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  bpGlowTop: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 220,
    height: 160,
    borderRadius: 110,
    backgroundColor: 'rgba(88,204,2,0.16)',
    transform: [{ rotate: '-15deg' }],
  },
  bpGlowBottom: {
    position: 'absolute',
    bottom: -50,
    right: -30,
    width: 180,
    height: 140,
    borderRadius: 90,
    backgroundColor: 'rgba(28,176,246,0.14)',
    transform: [{ rotate: '20deg' }],
  },
  bpOrb1: {
    position: 'absolute',
    top: 20,
    right: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,150,0,0.12)',
  },
  bpOrb2: {
    position: 'absolute',
    bottom: 10,
    left: '40%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(88,204,2,0.12)',
  },
  battlePassHeroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  battlePassEyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  battlePassEyebrowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#9FE870' },
  battlePassEyebrow: { fontSize: 11, color: '#CFEFC2', ...FONTS.bold, letterSpacing: 2 },
  battlePassTitle: { fontSize: 24, color: COLORS.white, ...FONTS.bold, marginTop: 6 },
  battlePassSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, maxWidth: 220 },
  battlePassStateBadge: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: UI.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(207,239,194,0.22)',
  },
  battlePassStateText: { fontSize: 11, color: '#E7F4DF', ...FONTS.bold },
  battlePassActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  battlePassPrimaryButton: {
    flex: 1,
    backgroundColor: SHOP_PALETTE.mintStrong,
    borderRadius: UI.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: SHOP_PALETTE.mintShadow,
  },
  battlePassPrimaryButtonText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  battlePassSecondaryButton: {
    minWidth: 110,
    backgroundColor: SHOP_PALETTE.blueStrong,
    borderRadius: UI.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.blueDark,
    paddingHorizontal: 14,
  },
  battlePassSecondaryButtonText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  battlePassTrack: { paddingRight: 16, gap: 12 },
  rewardCard: { width: 188, backgroundColor: SHOP_PALETTE.panel, borderRadius: UI.radius.lg, padding: 16, borderWidth: 1, borderColor: SHOP_PALETTE.line, overflow: 'hidden' },
  rewardCardPremium: { backgroundColor: SHOP_PALETTE.amberSoft, borderColor: SHOP_PALETTE.amberLine },
  rewardCardClaimed: { borderColor: '#A7D7B1', backgroundColor: '#F3FBF1', shadowColor: '#8BC49B', shadowOpacity: 0.12, shadowRadius: 10, elevation: 3 },
  rewardCardAvailable: { borderColor: SHOP_PALETTE.mintStrong, backgroundColor: SHOP_PALETTE.panelAlt, shadowColor: SHOP_PALETTE.mintStrong, shadowOpacity: 0.2, shadowRadius: 14, elevation: 6 },
  rewardGlow: {
    position: 'absolute',
    left: -40,
    right: -40,
    top: -26,
    height: 110,
    backgroundColor: 'rgba(88,204,2,0.16)',
    transform: [{ rotate: '-8deg' }],
  },
  rewardGlowPremium: {
    backgroundColor: 'rgba(255,150,0,0.14)',
  },
  rewardClaimedGlow: {
    position: 'absolute',
    left: -30,
    right: -30,
    top: -18,
    height: 90,
    backgroundColor: 'rgba(88,204,2,0.10)',
    transform: [{ rotate: '-6deg' }],
  },
  rewardClaimedGlowPremium: {
    backgroundColor: 'rgba(255,150,0,0.10)',
  },
  rewardReadyRibbon: {
    position: 'absolute',
    top: 12,
    right: -30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SHOP_PALETTE.mintStrong,
    paddingHorizontal: 30,
    paddingVertical: 6,
    transform: [{ rotate: '18deg' }],
    zIndex: 2,
  },
  rewardReadyRibbonPremium: {
    backgroundColor: SHOP_PALETTE.amberStrong,
  },
  rewardReadyRibbonText: { fontSize: 10, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  rewardClaimedRibbon: {
    position: 'absolute',
    top: 12,
    right: -34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7BC67E',
    paddingHorizontal: 32,
    paddingVertical: 6,
    transform: [{ rotate: '18deg' }],
    zIndex: 2,
  },
  rewardClaimedRibbonPremium: {
    backgroundColor: '#E9A840',
  },
  rewardClaimedRibbonText: { fontSize: 10, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  rewardCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rewardLevel: { fontSize: 11, color: SHOP_PALETTE.ink, ...FONTS.bold, letterSpacing: 0.9 },
  rewardLane: { fontSize: 11, color: SHOP_PALETTE.blueStrong, ...FONTS.bold, backgroundColor: SHOP_PALETTE.blueSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: UI.radius.pill },
  rewardLanePremium: { color: SHOP_PALETTE.amberStrong, backgroundColor: '#FFE7C2' },
  rewardIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginTop: 14, borderWidth: 1, borderColor: SHOP_PALETTE.line },
  rewardIconWrapAvailable: { backgroundColor: '#F0FBEA', borderWidth: 1, borderColor: 'rgba(88,204,2,0.28)' },
  rewardIconWrapAvailablePremium: { backgroundColor: '#FFF3DF', borderColor: 'rgba(255,150,0,0.3)' },
  rewardIconWrapClaimed: { backgroundColor: '#E6F7E8', borderColor: 'rgba(70,163,2,0.24)' },
  rewardIconWrapClaimedPremium: { backgroundColor: '#FFF0D8', borderColor: 'rgba(233,168,64,0.28)' },
  rewardTitle: { fontSize: 17, color: SHOP_PALETTE.ink, ...FONTS.bold, marginTop: 14 },
  rewardSubtitle: { fontSize: 12, color: COLORS.inkSoft, marginTop: 6, lineHeight: 18, minHeight: 36 },
  rewardGemText: { fontSize: 15, color: SHOP_PALETTE.blueStrong, ...FONTS.bold, marginTop: 12 },
  rewardPriceText: { fontSize: 11, color: COLORS.inkSoft, ...FONTS.medium, marginTop: 6 },
  rewardClaimedFooter: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F7EA',
    borderRadius: UI.radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  rewardClaimedFooterText: { fontSize: 11, color: SHOP_PALETTE.mintShadow, ...FONTS.bold },
  rewardClaimButton: {
    marginTop: 12,
    backgroundColor: SHOP_PALETTE.mintStrong,
    borderRadius: UI.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    borderBottomWidth: 4,
    borderBottomColor: SHOP_PALETTE.mintShadow,
  },
  rewardClaimButtonPremium: {
    backgroundColor: SHOP_PALETTE.amberStrong,
    borderBottomColor: COLORS.accentDark,
  },
  rewardClaimButtonLocked: {
    backgroundColor: '#B8C6BE',
    borderBottomColor: '#95A59B',
  },
  rewardClaimButtonClaimed: {
    backgroundColor: '#7BC67E',
    borderBottomColor: '#5EA761',
  },
  rewardClaimButtonClaimedPremium: {
    backgroundColor: '#E9A840',
    borderBottomColor: '#C68422',
  },
  rewardClaimButtonText: { fontSize: 12, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.8 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: SHOP_PALETTE.ink, ...FONTS.bold, marginBottom: 12 },
  shopTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  heartsTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heartStatus: { backgroundColor: SHOP_PALETTE.coralSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: SHOP_PALETTE.coralLine },
  heartStatusText: { fontSize: 13, color: SHOP_PALETTE.coralStrong, ...FONTS.bold },
  heartsCard: { backgroundColor: SHOP_PALETTE.panel, borderRadius: UI.radius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: SHOP_PALETTE.line, ...SHADOWS.small },
  heartsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  refillButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: SHOP_PALETTE.coralStrong, paddingHorizontal: 24, paddingVertical: 12, borderRadius: UI.radius.md, gap: 10, borderBottomWidth: 4, borderBottomColor: COLORS.redDark },
  refillButtonText: { fontSize: 15, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  priceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 3 },
  priceText: { fontSize: 13, color: COLORS.white, ...FONTS.bold },
  fullHeartsTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fullHeartsText: { fontSize: 14, color: SHOP_PALETTE.mintStrong, ...FONTS.semiBold },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shopCard: { width: '48%', backgroundColor: SHOP_PALETTE.panel, borderRadius: UI.radius.md, padding: 16, borderWidth: 1, borderColor: SHOP_PALETTE.line, alignItems: 'center', flexGrow: 1 },
  shopCardIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: SHOP_PALETTE.panelAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: SHOP_PALETTE.line },
  shopCardName: { fontSize: 15, color: SHOP_PALETTE.ink, ...FONTS.bold, textAlign: 'center' },
  shopCardDesc: { fontSize: 12, color: COLORS.inkSoft, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  gemPrice: { flexDirection: 'row', alignItems: 'center', backgroundColor: SHOP_PALETTE.blueSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 4, borderWidth: 1, borderColor: SHOP_PALETTE.blueLine },
  gemPriceText: { fontSize: 14, color: SHOP_PALETTE.blueStrong, ...FONTS.bold },
  freeTag: { backgroundColor: SHOP_PALETTE.mintStrong, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  freeTagText: { fontSize: 12, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  premiumCard: { backgroundColor: SHOP_PALETTE.nightAlt, borderRadius: UI.radius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(207,239,194,0.18)', ...SHADOWS.medium },
  premiumBadge: { backgroundColor: SHOP_PALETTE.amberStrong, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  premiumBadgeText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 2 },
  premiumTitle: { fontSize: 24, color: COLORS.white, ...FONTS.bold, marginBottom: 8 },
  premiumDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 20 },
  premiumButton: { backgroundColor: SHOP_PALETTE.amberStrong, paddingHorizontal: 32, paddingVertical: 16, borderRadius: UI.radius.md, borderBottomWidth: 4, borderBottomColor: COLORS.accentDark, width: '100%', alignItems: 'center' },
  premiumButtonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  premiumModalContent: { backgroundColor: SHOP_PALETTE.panel, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '90%' },
  premiumModalHeader: { alignItems: 'center', marginBottom: 24 },
  premiumModalTitle: { fontSize: 26, color: SHOP_PALETTE.ink, ...FONTS.bold },
  premiumModalSub: { fontSize: 14, color: COLORS.inkSoft, marginTop: 4, textAlign: 'center' },
  premiumFeaturesList: { gap: 16, marginBottom: 24 },
  premiumFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  premiumFeatureTitle: { fontSize: 15, color: SHOP_PALETTE.ink, ...FONTS.bold },
  premiumFeatureDesc: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  premiumCTA: { backgroundColor: SHOP_PALETTE.amberStrong, borderRadius: UI.radius.md, padding: 18, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.accentDark },
  premiumCTAText: { fontSize: 17, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  premiumCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  premiumSkip: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  premiumSkipText: { fontSize: 15, color: COLORS.wolf, ...FONTS.medium },
});
