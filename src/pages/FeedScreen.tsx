import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, useToggleTheme } from '../theme/ThemeContext';
import TimelineColumn from '../components/TimelineColumn';
import PostContent from '../components/PostContent';
import PostActions from '../components/PostActions';

const posts = [
  {
    id: '1',
    community: 'c/buildinpublic',
    user: 'Nikhila Shah',
    time: '7h',
    title:
      'Fintech CTO Validation Session\nWe have Demo Day in 2 weeks and our pitch deck needs work. Looking for engineers/investors who can provide.',
    image: null,
    comments: 26,
  },
  {
    id: '2',
    community: 'c/buildinpublic',
    user: 'Akash Agarwal',
    time: '7h',
    title: 'Our team just closed a $2M seed round! 🎉',
    image: null,
    comments: 112,
  },
  {
    id: '3',
    community: 'c/buildinpublic',
    user: 'Nikhila Shah',
    time: '7h',
    title: 'Just finished setting up my new home office! What do you think?',
    image: 'https://picsum.photos/600/350',
    comments: 26,
  },
  {
    id: '4',
    community: 'c/startups',
    user: 'Alex',
    time: '5h',
    title: 'Launching our beta this weekend 🚀',
    image: 'https://picsum.photos/600/351',
    comments: 18,
  },
  {
    id: '5',
    community: 'c/design',
    user: 'Meera',
    time: '4h',
    title: 'Redesigned our landing page ✨',
    image: 'https://picsum.photos/600/352',
    comments: 34,
  },
  {
    id: '6',
    community: 'c/entrepreneur',
    user: 'Riya',
    time: '3h',
    title: 'Finally hit 10k users!',
    image: null,
    comments: 42,
  },
  {
    id: '7',
    community: 'c/tech',
    user: 'Sam',
    time: '2h',
    title: 'AI tools are changing everything.',
    image: 'https://picsum.photos/600/353',
    comments: 50,
  },
  {
    id: '8',
    community: 'c/buildinpublic',
    user: 'David',
    time: '1h',
    title: 'Working on something exciting...',
    image: null,
    comments: 8,
  },
];

export default function FeedScreen() {
  const theme = useTheme();
  const toggle = useToggleTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={theme.mode === 'light' ? 'dark-content' : 'light-content'}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggle}>
            <Ionicons
              name={theme.mode === 'light' ? 'moon' : 'sunny'}
              size={22}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="search" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            {/* Timeline Column */}
            <TimelineColumn />
            <PostContent
              community={item.community}
              user={item.user}
              time={item.time}
              title={item.title}
              image={item.image}
            >
              <PostActions comments={item.comments} />
            </PostContent>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});
