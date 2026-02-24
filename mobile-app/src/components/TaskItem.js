import React from "react";
import { StyleSheet } from "react-native";
import { List, Button } from "react-native-paper";

export const TaskItem = ({ item, onDelete }) => {
  return (
    <List.Item
      title={item.name}
      description={`${item.schedule} • ${item.message}`}
      left={(props) => <List.Icon {...props} icon="clock-outline" />}
      right={(props) => (
        <Button onPress={() => onDelete(item.id)} compact textColor="red">
          Delete
        </Button>
      )}
      style={styles.listItem}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
