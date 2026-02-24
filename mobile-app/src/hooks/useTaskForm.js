import { useState } from "react";

export const useTaskForm = () => {
  const [name, setName] = useState("");
  const [intervalValue, setIntervalValue] = useState("5");
  const [intervalUnit, setIntervalUnit] = useState("minutes");
  const [message, setMessage] = useState("");
  const [scheduleType, setScheduleType] = useState("recurring");
  const [date, setDate] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setIntervalValue("5");
    setIntervalUnit("minutes");
    setMessage("");
    setScheduleType("recurring");
    setDate(new Date());
  };

  const getCronSchedule = () => {
    let schedule = "";
    if (scheduleType === "recurring") {
      const val = parseInt(intervalValue, 10);
      if (isNaN(val) || val <= 0) return null;

      switch (intervalUnit) {
        case "minutes":
          schedule = `*/${val} * * * *`;
          break;
        case "hours":
          schedule = `0 */${val} * * *`;
          break;
        case "days":
          schedule = `0 0 */${val} * *`;
          break;
        case "weeks":
          schedule = `0 0 * * 0`;
          break;
        default:
          schedule = `*/5 * * * *`;
      }
    } else {
      const min = date.getMinutes();
      const hour = date.getHours();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      schedule = `${min} ${hour} ${day} ${month} *`;
    }
    return schedule;
  };

  return {
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
  };
};
