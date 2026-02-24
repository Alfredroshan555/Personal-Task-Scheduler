import React from "react";
import { Appbar } from "react-native-paper";

export const Header = ({ onRefresh }) => {
  return (
    <Appbar.Header elevated>
      <Appbar.Content title="Task Scheduler" />
      <Appbar.Action icon="refresh" onPress={onRefresh} />
    </Appbar.Header>
  );
};
