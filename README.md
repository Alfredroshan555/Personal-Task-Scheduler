# 🚀 Personal Task Scheduler

A robust and intuitive task management system designed to streamline your productivity. This project features a **Node.js/Express backend** with **Twilio WhatsApp integration** for powerful scheduling and a **React Native mobile application** for on-the-go task tracking.

## ✨ Key Features

- 📅 **Dual Scheduling**:
  - **Recurring**: Create tasks using specific cron expressions (e.g., every Thursday at 9:45 AM).
  - **One-time**: Schedule specific tasks for a future date and time.
- 💬 **WhatsApp Notifications**: Receive instant reminders directly on your WhatsApp via **Twilio**.
- 📊 **Task Management**: Easily add, view, and delete tasks through the mobile interface.
- 🔄 **Real-time Synchronization**: Backend and Frontend stay in sync via a RESTful API.
- ⚡ **Cloud-Ready**: Optimized for deployment on Render with built-in keep-alive logic.

## 🛠️ Tech Stack

### Backend

- **Node.js & Express**: Core server and API framework.
- **node-cron**: Precision recurring task scheduling.
- **Twilio SDK**: Reliable WhatsApp notification delivery.
- **MongoDB & Mongoose**: Scalable NoSQL database storage.

### Mobile App

- **React Native (Expo)**: Cross-platform mobile development.
- **React Native Paper**: Premium Material Design component library.
- **Axios**: Efficient HTTP client for API communication.
- **DateTimePicker**: Native date and time selection.

## 🚀 Getting Started

### 1. Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file with your **Twilio** and **MongoDB** credentials:
   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   WHATSAPP_TO=whatsapp:+YourPhoneNumber
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Start the server: `npm run dev`.

### 2. Frontend (Mobile App) Setup

1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Run the app: `npm run start`.

## 📁 Project Structure

```text
├── backend/            # Modularized Express server
│   ├── index.js        # Main entry point & keep-alive logic
│   ├── db.js           # Database connection
│   ├── controllers/    # Request handling logic
│   ├── models/         # Mongoose schemas (Recurring & One-time)
│   ├── routes/         # API route definitions
│   └── services/       # Scheduling and notification services
│       ├── schedulerService.js  # The scheduling engine
│       └── notifier.js          # Twilio WhatsApp logic
├── frontend/           # React Native (Expo) mobile application
│   ├── src/            # Source code (components, hooks, theme)
│   └── App.js          # Main app entry point
└── README.md           # Project documentation
```
