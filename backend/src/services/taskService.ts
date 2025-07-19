import { Task } from '../types/task'

let tasks: Task[] = []

let nextId = 1
const generateId = (): number => {
  return nextId++
}

export const taskService = {
  getAllTasks(): Task[] {
    return tasks
  },

  getTaskById(id: number): Task | undefined {
    return tasks.find((task) => task.id === id)
  },

  createTask(newTaskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      id: generateId(),
      ...newTaskData,
      createdAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    return newTask
  },

  updateTask(id: number, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | undefined {
    const taskIndex = tasks.findIndex((task) => task.id === id)

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
      return tasks[taskIndex]
    }
    return undefined
  },

  deleteTask(id: number): boolean {
    const initLength = tasks.length
    tasks = tasks.filter((task) => task.id !== id)
    return tasks.length < initLength
  },
}
