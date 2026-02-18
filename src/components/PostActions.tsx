import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface PostActionsProps {
  comments: number;
}

const PostActions: React.FC<PostActionsProps> = ({ comments }) => {
  const theme = useTheme();
  return (
    <View style={styles.actions}>
      <TouchableOpacity style={styles.actionItem}>
        <Ionicons name="heart-outline" size={18} color={theme.colors.muted} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionItem}>
        <Ionicons
          name="chatbubble-outline"
          size={18}
          color={theme.colors.muted}
        />
        <Text style={[styles.commentText, { color: theme.colors.subtext }]}>
          {comments} replies
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionItem}>
        <Ionicons
          name="paper-plane-outline"
          size={18}
          color={theme.colors.muted}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  commentText: {
    color: '#aaa',
    marginLeft: 5,
    fontSize: 13,
  },
});

export default PostActions;
