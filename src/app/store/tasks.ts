import { createEvent, createStore, createEffect, sample } from 'effector'
import { type Task } from '@entities/task/ui/types/types'

const API_BASE_URL = 'https://todo-backend-ugmb.onrender.com'

export const taskCreated = createEvent<Task>()
export const taskUpdated = createEvent<Task>()
export const taskDeleted = createEvent<number>()

export const dateSortChanged = createEvent<string>()
export const titleSortChanged = createEvent<string>()

export const fetchTasksFx = createEffect<void, Task[], Error>(async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return (await response.json()) as Task[]
})

/**
 * @effect getTaskByIdFx
 * @description эффект для получения одной задачи по её идентификатору
 * @param {number} id - идентификатор задачи
 * @returns {Promise<Task | undefined>} объект задачи (undefined, если задача не найдена)
 * @throws {Error} в случае HTTP-ошибок
 */
export const getTaskByIdFx = createEffect<number, Task | undefined, Error>(async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`)
    if (response.status === 404) {
      return undefined
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return (await response.json()) as Task
  } catch (error) {
    console.error(`Error getting task with ID ${id}:`, error)
    throw error
  }
})

/**
 * @effect addTaskFx
 * @description эффект для добавления новой задачи на сервер
 * @param {Omit<Task, 'id' | 'createdAt'>} taskData - данные новой задачи (без id и createdAt - генерируемых на сервере)
 * @returns {Promise<Task>} созданный объект задачи с id и createdAt
 */
export const addTaskFx = createEffect<Omit<Task, 'id' | 'createdAt'>, Task, Error>(async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      category: taskData.category,
      status: taskData.status,
    }),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return (await response.json()) as Task
})

/**
 * @effect updateTaskFx
 * @description эффект для обновления существующей задачи на сервере
 * @param {Task} updatedTask - объект задачи с обновленными данными
 * @returns {Promise<Task>} обновленный объект задачи
 */
export const updateTaskFx = createEffect<Task, Task, Error>(async (updatedTask) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${updatedTask.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      category: updatedTask.category,
      status: updatedTask.status,
    }),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return (await response.json()) as Task
})

/**
 * @effect deleteTaskFx
 * @description эффект для удаления задачи с сервера
 * @param {number} id - идентификатор задачи для удаления
 * @returns {Promise<void>}
 */
export const deleteTaskFx = createEffect<number, void, Error>(async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
})

/**
 * @store $tasks
 * @description массив всех задач
 * @type {Task[]}
 */
export const $tasks = createStore<Task[]>([])

/**
 * @store $tasksLoading
 * @description состояние загрузки задач
 * @type {boolean}
 */
export const $tasksLoading = fetchTasksFx.pending

export const $searchTerm = createStore<string>('')
export const searchTermChanged = createEvent<string>()

/**
 * @event categoryFilterChanged
 * @description событие, которое диспатчится при изменении выбранной категории фильтрации
 * @param {string} category выбранная категория
 */
export const categoryFilterChanged = createEvent<string>()

/**
 * @store $selectedCategory
 * @description стор, хранящий текущую выбранную категорию для фильтрации задач
 * @type {string}
 */
export const $selectedCategory = createStore<string>('All')

/**
 * @event priorityFilterChanged
 * @description cобытие, которое диспатчится при изменении выбранного приоритета фильтрации.
 * @param {string} priority dыбранный приоритет
 */
export const priorityFilterChanged = createEvent<string>()

/**
 * @store $selectedPriority
 * @description cтор, хранящий текущий выбранный приоритет для фильтрации задач
 * @type {string}
 */
export const $selectedPriority = createStore<string>('All')

export const $selectedDateSort = createStore<string>('Date')
export const $selectedTitleSort = createStore<string>('Title')

$tasks
  .on(addTaskFx.doneData, (tasks, newTask) => [newTask, ...tasks])
  .on(fetchTasksFx.doneData, (_, fetchedTasks) => {
    // сортировка задач по убыванию даты создания (самые новые сверху)
    if (Array.isArray(fetchedTasks)) {
      return fetchedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      return []
    }
  })
  .on(updateTaskFx.doneData, (tasks, updatedTask) =>
    tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  )
  .on(deleteTaskFx.done, (tasks, { params: id }) => tasks.filter((task) => task.id !== id))

$searchTerm.on(searchTermChanged, (_, term) => (term === undefined ? '' : term))
$selectedCategory.on(categoryFilterChanged, (_, category) => (category === undefined ? 'All' : category))
$selectedPriority.on(priorityFilterChanged, (_, priority) => (priority === undefined ? 'All' : priority))
$selectedDateSort.on(dateSortChanged, (_, sort) => (sort === undefined ? 'Date' : sort))
$selectedTitleSort.on(titleSortChanged, (_, sort) => (sort === undefined ? 'Title' : sort))

export const $displayedTasks = createStore<Task[]>([])

sample({
  clock: [$tasks, $searchTerm, $selectedCategory, $selectedPriority, $selectedDateSort, $selectedTitleSort],
  source: {
    tasks: $tasks,
    searchTerm: $searchTerm,
    selectedCategory: $selectedCategory,
    selectedPriority: $selectedPriority,
    selectedDateSort: $selectedDateSort,
    selectedTitleSort: $selectedTitleSort,
  },
  fn: ({ tasks, searchTerm, selectedCategory, selectedPriority, selectedDateSort, selectedTitleSort }) => {
    let currentTasks = Array.isArray(tasks) ? [...tasks] : []

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      currentTasks = currentTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          (task.description?.toLowerCase() || '').includes(lowerCaseSearchTerm),
      )
    }

    if (selectedCategory !== 'All') {
      currentTasks = currentTasks.filter((task) => task.category === selectedCategory)
    }

    if (selectedPriority !== 'All') {
      currentTasks = currentTasks.filter((task) => task.priority === selectedPriority)
    }

    if (selectedDateSort === 'Newest') {
      currentTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (selectedDateSort === 'Oldest') {
      currentTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    if (selectedTitleSort === 'Az') {
      currentTasks.sort((a, b) => a.title.localeCompare(b.title))
    } else if (selectedTitleSort === 'Za') {
      currentTasks.sort((a, b) => b.title.localeCompare(a.title))
    }

    return currentTasks
  },
  target: $displayedTasks,
})
