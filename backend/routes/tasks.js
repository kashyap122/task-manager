const express = require("express");
const Task = require("../models/task.model");
// const User = require("../models/auth.model");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();

/**
 * @route   POST /tasks
 * @desc    Create a task (Users can only assign tasks to themselves)
 * @access  Authenticated Users
 */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedTo } = req.body;

    const assignedUser = req.user.role === "admin" ? assignedTo : req.user.id;

    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      createdBy: req.user.id,
      assignedTo: assignedUser,
    });
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully!", task: newTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   GET /tasks/mytasks
 * @desc    Users can view their own tasks (Created by them OR assigned to them)
 * @access  Authenticated Users
 */

router.get("/mytasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    }).populate("createdBy assignedTo", "username email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single task from id (GET)
// router.get("/mytasks/:id", authMiddleware, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found!",
//       });
//     }
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching task",
//       error: error.message,
//     });
//   }
// });

/**
 * @route   POST /tasks/update/:id
 * @desc    Users can update their own tasks but not tasks assigned to them
 * @access  Authenticated Users
 */

// Update the task (PUT)
router.post("/update/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found!" });

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized! You can only update tasks you created.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Task updated Successfully!", Task: updatedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   POST /tasks/delete/:id
 * @desc    Users can delete their own tasks but not tasks assigned to them
 * @access  Authenticated Users
 */

//Delete task (DELETE)
router.post("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found!" });

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized! You can only delete tasks you created.",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task Deleted Succesfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /tasks
 * @desc    Admin can view all tasks
 * @access  Admin Only
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "createdBy assignedTo",
      "username email"
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /tasks/assign/:id
 * @desc    Admin can assign tasks to other users
 * @access  Admin Only
 */
router.post(
  "/assign/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { assignedTo } = req.body;

      const task = await Task.findById(req.params.id);

      if (!task) return res.status(404).json({ message: "Task not found!" });

      task.assignedTo = assignedTo;
      await task.save();
      res.json({ message: "Task assigned successfully!", task });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route   POST /tasks/delete/admin/:id
 * @desc    Admin can delete any task
 * @access  Admin Only
 */
router.post(
  "/delete/admin/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: "Task deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route   GET /tasks/user/:userId
 * @desc    Admin can view tasks of a specific user
 * @access  Admin Only
 */
router.get(
  "/user/:userId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Fetch all tasks created by the specified user
      const tasks = await Task.find({ createdBy: userId }).populate(
        "assignedTo",
        "username email"
      );

      if (tasks.length === 0) {
        return res
          .status(404)
          .json({ message: "No tasks found for this user!" });
      }

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//tasks assigned to logged in user
// router.get("/assigned", authMiddleware, async (req, res) => {
//   try {
//     const tasks = await Task.find({
//       assignedTo: req.user.id,
//       createdBy: { $ne: req.user.id },
//     }).populate("createdBy", "username email");

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/visible", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const tasks = await Task.find({
//       $or: [{ createdBy: userId }, { assignedTo: userId }],
//     }).populate("createdBy assignedTo", "username email");
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
