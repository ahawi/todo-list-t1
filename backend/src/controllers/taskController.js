"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const taskService_1 = require("../services/taskService");
exports.taskController = {
    getAllTasks(req, res) {
        const tasks = taskService_1.taskService.getAllTasks();
        res.json(tasks);
    },
    getTaskById(req, res) {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            res.status(400).send('Invalid task Id');
            return;
        }
        const task = taskService_1.taskService.getTaskById(taskId);
        if (task) {
            res.json(task);
        }
        else {
            res.status(404).send('Task not found');
        }
    },
    createTask(req, res) {
        const { title, description, priority, category, status } = req.body;
        if (!title || !priority || !category || !status) {
            res.status(400).send('Title, priority, category, and status sre required');
            return;
        }
        const newTaskData = {
            title,
            description,
            priority,
            category,
            status,
        };
        const newTask = taskService_1.taskService.createTask(newTaskData);
        res.status(201).json(newTask);
    },
    updateTask(req, res) {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            res.status(400).send('Invalid task ID');
            return;
        }
        const updates = req.body;
        const updatedTask = taskService_1.taskService.updateTask(taskId, updates);
        if (updatedTask) {
            res.json(updatedTask);
        }
        else {
            res.status(404).send('Task not found');
        }
    },
    deleteTask(req, res) {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            res.status(400).send('Invalid task ID');
            return;
        }
        const isDeleted = taskService_1.taskService.deleteTask(taskId);
        if (isDeleted) {
            res.status(204).send();
        }
        else {
            res.status(404).send('Task not found');
        }
    },
};
