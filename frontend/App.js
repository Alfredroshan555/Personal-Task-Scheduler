import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Provider as PaperProvider,
  FAB,
  Portal,
  Snackbar,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Custom Components
import { Header } from "./src/components/Header";
import { TaskList } from "./src/components/TaskList";
import { TaskModal } from "./src/components/TaskModal";

// Custom Hooks
import { useTasks } from "./src/hooks/useTasks";
import { useSnackbar } from "./src/hooks/useSnackbar";

// Theme
import { theme } from "./src/theme";

export default function App() {
  const {
    visible: snackbarVisible,
    message: snackbarMessage,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const { tasks, loading, fetchTasks, deleteTask, addTask } =
    useTasks(showSnackbar);
  const [modalVisible, setModalVisible] = useState(false);

  const showDialog = () => setModalVisible(true);
  const hideDialog = () => setModalVisible(false);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <Header onRefresh={fetchTasks} />

          <TaskList tasks={tasks} loading={loading} onDelete={deleteTask} />

          <Portal>
            <TaskModal
              visible={modalVisible}
              onHide={hideDialog}
              onAddTask={addTask}
              showSnackbar={showSnackbar}
            />
          </Portal>

          <FAB
            style={styles.fab}
            icon="plus"
            onPress={showDialog}
            label="Add Task"
            color="white"
          />

          <Snackbar
            visible={snackbarVisible}
            onDismiss={hideSnackbar}
            duration={3000}
            action={{
              label: "Close",
              onPress: hideSnackbar,
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
