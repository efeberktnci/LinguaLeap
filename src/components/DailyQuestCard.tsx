import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import { DailyQuest } from '../types';
import AppSymbol from './AppSymbol';
import ProgressBar from './ProgressBar';

interface DailyQuestCardProps {
  quest: DailyQuest;
}

const DailyQuestCard: React.FC<DailyQuestCardProps> = ({ quest }) => {
  const progress = Math.min(quest.progress / quest.target, 1);

  return (
    <View style={[styles.container, quest.completed && styles.containerCompleted]}>
      <View style={styles.iconContainer}>
        <AppSymbol symbol={quest.icon} size={20} color={COLORS.blueDark} style={styles.icon} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, quest.completed && styles.titleCompleted]}>{quest.title}</Text>
        <ProgressBar
          progress={progress}
          height={10}
          color={quest.completed ? COLORS.primary : COLORS.blue}
          style={{ marginTop: 6 }}
        />
      </View>
      <View style={styles.reward}>
        {quest.completed ? (
          <View style={styles.checkmark}>
            <AppSymbol symbol="✓" size={14} color={COLORS.white} style={styles.checkmarkText} />
          </View>
        ) : (
          <Text style={styles.xpText}>+{quest.xpReward} XP</Text>
        )}
      </View>
    </View>
  );
};

export default DailyQuestCard;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 2, borderColor: COLORS.swan, marginBottom: 8 },
  containerCompleted: { borderColor: COLORS.primaryBg, backgroundColor: '#F8FFF0' },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  title: { fontSize: 14, color: COLORS.eel, ...FONTS.semiBold },
  titleCompleted: { color: COLORS.primaryDark },
  reward: { marginLeft: 12 },
  xpText: { fontSize: 13, color: COLORS.accent, ...FONTS.bold },
  checkmark: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  checkmarkText: { color: COLORS.white, fontSize: 14, ...FONTS.bold },
});
