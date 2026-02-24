# 🚀 Personal Task Scheduler

A robust and intuitive task management system designed to streamline your productivity. This project features a **Node.js/Express backend** for powerful scheduling and a **React Native mobile application** for on-the-go task tracking.

## ✨ Key Features

- 📅 **Dynamic Scheduling**: Create tasks with custom intervals (minutes, hours, days, weeks) or specific cron expressions.
- 🔔 **Instant Notifications**: Receive email alerts for upcoming deadlines and reminders via `nodemailer`.
- 📊 **Task Prioritization**: Categorize and prioritize your tasks to focus on what matters most.
- 📱 **Mobile-First Design**: A modern, responsive mobile UI built with React Native and Material Design themes.
- 🔄 **Real-time Sync**: Backend and Frontend stay in sync with a RESTful API.
- 🛠️ **Seamless Management**: Easily add, view, and delete tasks through the mobile interface.

## 🛠️ Tech Stack

### Backend

- **Node.js & Express**: Core server and API framework.
- **node-cron**: Precision task scheduling engine.
- **Nodemailer**: Reliable email delivery service.
- **FileSystem (JSON)**: Lightweight and portable task storage.

### Mobile App

- **React Native (Expo)**: Cross-platform mobile development.
- **React Native Paper**: Premium Material Design component library.
- **Axios**: Efficient HTTP client for API communication.
- **Hooks & Context**: Clean state management for a smooth UX.

## 🚀 Getting Started

### 1. Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file with your email configuration (see `.env.example`).
4. Start the server: `npm run dev`.

### 2. Mobile App Setup

1. Navigate to the `mobile-app` directory.
2. Install dependencies: `npm install`.
3. Update the API base URL in `src/hooks/useTasks.js` (if necessary).
4. Run the app: `npm run start`.

## 📁 Project Structure

```text
├── backend/            # Express server and scheduling logic
│   ├── index.js        # Main entry point
│   ├── tasks.json      # Local task storage
│   └── notifier.js     # Email notification logic
├── mobile-app/         # react-native-paper powered mobile application
│   ├── src/            # Source code (components, hooks, theme)
│   └── App.js          # Main app container
└── README.md           # Project documentation
```
