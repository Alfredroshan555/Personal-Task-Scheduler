import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { TaskItem } from "./TaskItem";

export const TaskList = ({ tasks, loading, onDelete }) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <TaskItem item={item} onDelete={onDelete} />}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No tasks found. Add a new one!</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 100,
  },
});
