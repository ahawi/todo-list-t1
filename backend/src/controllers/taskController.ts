import { Request, Response } from 'express'
import { taskService } from '../services/taskService'
import { Task } from '../types/task'

export const taskController = {
  getAllTasks(req: Request, res: Response): void {
    const tasks = taskService.getAllTasks()
    res.json(tasks)
  },

  getTaskById(req: Request, res: Response): void {
    const taskId = parseInt(req.params.id, 10)
    if (isNaN(taskId)) {
      res.status(400).send('Invalid task Id')
      return
    }

    const task = taskService.getTaskById(taskId)
    if (task) {
      res.json(task)
    } else {
      res.status(404).send('Task not found')
    }
  },

  createTask(req: Request, res: Response): void {
    const { title, description, priority, category, status } = req.body

    if (!title || !priority || !category || !status) {
      res.status(400).send('Title, priority, category, and status sre required')
      return
    }

    const newTaskData: Omit<Task, 'id' | 'createdAt'> = {
      title,
      description,
      priority,
      category,
      status,
    }

    const newTask = taskService.createTask(newTaskData)
    res.status(201).json(newTask)
  },

  updateTask(req: Request, res: Response): void {
    const taskId = parseInt(req.params.id, 10)
    if (isNaN(taskId)) {
      res.status(400).send('Invalid task ID')
      return
    }

    const updates: Partial<Omit<Task, 'id' | 'createdAt'>> = req.body

    const updatedTask = taskService.updateTask(taskId, updates)
    if (updatedTask) {
      res.json(updatedTask)
    } else {
      res.status(404).send('Task not found')
    }
  },

  deleteTask(req: Request, res: Response): void {
    const taskId = parseInt(req.params.id, 10)
    if (isNaN(taskId)) {
      res.status(400).send('Invalid task ID')
      return
    }

    const isDeleted = taskService.deleteTask(taskId)
    if (isDeleted) {
      res.status(204).send()
    } else {
      res.status(404).send('Task not found')
    }
  },
}
