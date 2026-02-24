const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  deleteTask,
  debugDB,
} = require("../controllers/taskController");

// Task routes
router.get("/", getTasks);
router.post("/", addTask);
router.delete("/:id", deleteTask);

// Debug route
router.get("/debug-db", debugDB);

module.exports = router;
