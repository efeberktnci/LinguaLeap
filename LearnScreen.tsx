import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../theme/colors';
import { UNITS, QUIZ_QUESTIONS } from '../data/mockData';
import { Lesson, RootStackParamList } from '../types';
import TopBar from '../components/TopBar';
import UnitHeader from '../components/UnitHeader';
import LessonNode from '../components/LessonNode';

type LearnNavProp = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;

const LearnScreen: React.FC = () => {
  const navigation = useNavigation<LearnNavProp>();

  const handleLessonPress = (lesson: Lesson) => {
    const questions = QUIZ_QUESTIONS[lesson.id] ?? QUIZ_QUESTIONS['lesson_3_2'];
    navigation.navigate('Lesson', { lesson, questions });
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {UNITS.map((unit) => (
          <View key={unit.id}>
            <UnitHeader unit={unit} />
            <View style={styles.lessonPath}>
              {unit.lessons.map((lesson, index) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  unitColor={unit.color}
                  unitShadow={unit.shadowColor}
                  onPress={handleLessonPress}
                  index={index}
                />
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgSecondary },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  lessonPath: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
});
