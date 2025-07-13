import {type Task} from '../types/Task'

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Посмотреть лекции на портале',
    description: 'посмотреть + законспектировать + запомнить + заучить + вызубрить + зарубить на носу + использовать на практике',
    category: 'Feature',
    status: 'To Do',
    priority: 'Medium',
  },
  {
    id: 2,
    title: 'Перерыв на кошку',
    description: 'Перерыв на кошку Перерыв на кошку Перерыв на кошку Перерыв на кошку',
    category: 'Documentation',
    status: 'In Progress',
    priority: 'High',
  },
  {
    id: 3,
    title: 'Сдать домашнее задание в ит-лагере',
    description: 'Реализовать проект согласно техническим требованиям',
    category: 'Test', 
    status: 'Done',
    priority: 'Low',
  },
]

