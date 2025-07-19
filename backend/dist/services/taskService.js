"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
let tasks = [];
let nextId = 1;
const generateId = () => {
    return nextId++;
};
exports.taskService = {
    getAllTasks() {
        return tasks;
    },
    getTaskById(id) {
        return tasks.find((task) => task.id === id);
    },
    createTask(newTaskData) {
        const newTask = Object.assign(Object.assign({ id: generateId() }, newTaskData), { createdAt: new Date().toISOString() });
        tasks.push(newTask);
        return newTask;
    },
    updateTask(id, updates) {
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = Object.assign(Object.assign({}, tasks[taskIndex]), updates);
            return tasks[taskIndex];
        }
        return undefined;
    },
    deleteTask(id) {
        const initLength = tasks.length;
        tasks = tasks.filter((task) => task.id !== id);
        return tasks.length < initLength;
    },
};
