import { createEvent, createStore, createEffect } from "effector";
import { type Task } from "@entities/task/ui/types/types";

const API_BASE_URL = "https://todo-backend-ugmb.onrender.com";

/**
 * @event taskCreated
 * @description cобытие, которое диспатчится при успешном создании новой задачи
 * @param {Task} task - объект созданной задачи
 */
export const taskCreated = createEvent<Task>();

/**
 * @event taskUpdated
 * @description cобытие, которое диспатчится при успешном обновлении существующей задачи
 * @param {Task} task - объект обновленной задачи
 */
export const taskUpdated = createEvent<Task>();

/**
 * @event taskDeleted
 * @description cобытие, которое диспатчится при успешном удалении задачи
 * @param {number} id - идентификатор удаленной задачи
 */
export const taskDeleted = createEvent<number>();

/**
 * @effect fetchTasksFx
 * @description эффект для получения всех задач с сервера
 * @returns {Promise<Task[]>} массив объектов задач
 */
export const fetchTasksFx = createEffect<void, Task[], Error>(async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as Task[];
});

/**
 * @effect getTaskByIdFx
 * @description эффект для получения одной задачи по её идентификатору
 * @param {number} id - идентификатор задачи
 * @returns {Promise<Task | undefined>} объект задачи (undefined, если задача не найдена)
 * @throws {Error} в случае HTTP-ошибок
 */
export const getTaskByIdFx = createEffect<number, Task | undefined, Error>(
  async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      if (response.status === 404) {
        return undefined;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return (await response.json()) as Task;
    } catch (error) {
      console.error(`Error getting task with ID ${id}:`, error);
      throw error;
    }
  },
);

/**
 * @effect addTaskFx
 * @description эффект для добавления новой задачи на сервер
 * @param {Omit<Task, 'id' | 'createdAt'>} taskData - данные новой задачи (без id и createdAt - генерируемых на сервере)
 * @returns {Promise<Task>} созданный объект задачи с id и createdAt
 */
export const addTaskFx = createEffect<
  Omit<Task, "id" | "createdAt">,
  Task,
  Error
>(async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      category: taskData.category,
      status: taskData.status,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as Task;
});

/**
 * @effect updateTaskFx
 * @description эффект для обновления существующей задачи на сервере
 * @param {Task} updatedTask - объект задачи с обновленными данными
 * @returns {Promise<Task>} обновленный объект задачи
 */
export const updateTaskFx = createEffect<Task, Task, Error>(
  async (updatedTask) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${updatedTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        category: updatedTask.category,
        status: updatedTask.status,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as Task;
  },
);

/**
 * @effect deleteTaskFx
 * @description эффект для удаления задачи с сервера
 * @param {number} id - идентификатор задачи для удаления
 * @returns {Promise<void>}
 */
export const deleteTaskFx = createEffect<number, void, Error>(async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
});

/**
 * @store $tasks
 * @description массив всех задач
 * @type {Task[]}
 */
export const $tasks = createStore<Task[]>([]);

/**
 * @store $tasksLoading
 * @description состояние загрузки задач
 * @type {boolean}
 */
export const $tasksLoading = fetchTasksFx.pending;

$tasks
  .on(addTaskFx.doneData, (tasks, newTask) => [newTask, ...tasks])
  .on(fetchTasksFx.doneData, (_, fetchedTasks) => {
    // сортировка задач по убыванию даты создания (самые новые сверху)
    if (Array.isArray(fetchedTasks)) {
      return fetchedTasks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      return [];
    }
  })
  .on(updateTaskFx.doneData, (tasks, updatedTask) =>
    tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  )
  .on(deleteTaskFx.done, (tasks, { params: id }) =>
    tasks.filter((task) => task.id !== id),
  );
