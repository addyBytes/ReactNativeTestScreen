import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

import { ReactNode } from 'react';
interface PostContentProps {
  community: string;
  user: string;
  time: string;
  title: string;
  image?: string | null;
  children?: ReactNode;
}

const PostContent: React.FC<PostContentProps> = ({
  community,
  user,
  time,
  title,
  image,
  children,
}) =>
  (() => {
    const theme = useTheme();
    return (
      <View style={[styles.postContent, { paddingLeft: 10 }]}>
        <Text style={[styles.community, { color: theme.colors.subtext }]}>
          {community} · {user} · {time}
        </Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        {image && <Image source={{ uri: image }} style={styles.postImage} />}
        {children}
      </View>
    );
  })();

const styles = StyleSheet.create({
  postContent: {
    flex: 1,
    paddingLeft: 10,
  },
  community: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
});

export default PostContent;
