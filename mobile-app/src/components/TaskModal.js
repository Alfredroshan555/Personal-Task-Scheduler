import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Modal,
  TextInput,
  Button,
  Text,
  SegmentedButtons,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTaskForm } from "../hooks/useTaskForm";
import { theme } from "../theme";

export const TaskModal = ({ visible, onHide, onAddTask, showSnackbar }) => {
  const {
    name,
    setName,
    intervalValue,
    setIntervalValue,
    intervalUnit,
    setIntervalUnit,
    message,
    setMessage,
    scheduleType,
    setScheduleType,
    date,
    setDate,
    submitting,
    setSubmitting,
    resetForm,
    getCronSchedule,
  } = useTaskForm();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isShifted, setIsShifted] = useState(false);

  const handleHide = () => {
    setIsShifted(false);
    resetForm();
    onHide();
  };

  const handleSubmit = async () => {
    if (!name || !intervalValue || !message) {
      showSnackbar("Please fill in all fields");
      return;
    }

    const schedule = getCronSchedule();
    if (!schedule) {
      showSnackbar("Invalid interval value");
      return;
    }

    setSubmitting(true);
    const success = await onAddTask({ name, schedule, message });
    setSubmitting(false);

    if (success) {
      handleHide();
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleHide}
      contentContainerStyle={[
        styles.modalWrapper,
        isShifted && { marginBottom: 250 },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>✨ New Task</Text>
            <Text style={styles.modalSubtitle}>
              Schedule a task to run automatically
            </Text>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              label="Task Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="format-title" />}
              activeOutlineColor={theme.colors.primary}
            />

            <Text style={styles.sectionLabel}>Schedule Type</Text>
            <SegmentedButtons
              value={scheduleType}
              onValueChange={setScheduleType}
              buttons={[
                {
                  value: "recurring",
                  label: "Recurring",
                  icon: "repeat",
                },
                {
                  value: "one-time",
                  label: "One-time",
                  icon: "calendar-clock",
                },
              ]}
              density="medium"
              style={{ marginBottom: 16 }}
            />

            {scheduleType === "recurring" ? (
              <>
                <Text style={styles.sectionLabel}>Frequency</Text>
                <TextInput
                  value={intervalValue}
                  onChangeText={setIntervalValue}
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  keyboardType="numeric"
                  right={<TextInput.Affix text={intervalUnit} />}
                  activeOutlineColor={theme.colors.primary}
                  label="Interval Value"
                  //   onFocus={() => setIsShifted(true)}
                  //   onBlur={() => setIsShifted(false)}
                />

                <SegmentedButtons
                  value={intervalUnit}
                  onValueChange={setIntervalUnit}
                  buttons={[
                    { value: "minutes", label: "Minutes" },
                    { value: "hours", label: "Hours" },
                    { value: "days", label: "Days" },
                  ]}
                  density="medium"
                  style={{ marginBottom: 16 }}
                />
              </>
            ) : (
              <>
                <Text style={styles.sectionLabel}>Run On</Text>
                <View style={styles.dateTimeContainer}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateTimeButton}
                  >
                    <TextInput
                      label="Date"
                      value={date.toLocaleDateString()}
                      editable={false}
                      mode="outlined"
                      style={{ flex: 1 }}
                      outlineStyle={styles.inputOutline}
                      left={<TextInput.Icon icon="calendar" />}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    style={styles.dateTimeButton}
                  >
                    <TextInput
                      label="Time"
                      value={date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      editable={false}
                      mode="outlined"
                      style={{ flex: 1 }}
                      outlineStyle={styles.inputOutline}
                      left={<TextInput.Icon icon="clock-outline" />}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}

                {showTimePicker && (
                  <DateTimePicker
                    value={date}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowTimePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}
              </>
            )}

            <TextInput
              label="Message to send"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              style={[styles.input, styles.textArea]}
              outlineStyle={styles.inputOutline}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="message-text-outline" />}
              activeOutlineColor={theme.colors.primary}
              onFocus={() => setIsShifted(true)}
              onBlur={() => setIsShifted(false)}
            />
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              onPress={handleHide}
              mode="outlined"
              style={styles.cancelBtn}
              textColor="#666"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.submitBtn}
              contentStyle={{ paddingVertical: 4 }}
            >
              Create Task
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    padding: 20,
    margin: 0,
    justifyContent: "center",
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    elevation: 5,
    maxHeight: "90%",
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  modalScroll: {
    maxHeight: 400,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#F5F7FA",
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 0,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderColor: "#ddd",
    borderRadius: 12,
  },
  submitBtn: {
    flex: 1.5,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    elevation: 2,
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateTimeButton: {
    flex: 1,
  },
});
