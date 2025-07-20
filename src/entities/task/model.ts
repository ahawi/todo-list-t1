import { createEvent, createStore } from "effector";
import { type Task } from "./ui/types/types";

/**
 * @event addTask
 * @description добавление новой задачи в хранилище
 * @param {Task} payload  объект созданной задачи, полученный от сервера
 */
export const addTask = createEvent<Task>();

/**
 * @event updateTask
 * @description обновление существующей задачи в хранилище
 * @param {Task} payload объект задачи с обновленными данными
 */
export const updateTask = createEvent<Task>();

/**
 * @event deleteTask
 * @description удаление задачи из хранилища
 * @param {number} payload идентификатор задачи, которую нужно удалить
 */
export const deleteTask = createEvent<number>();

/**
 * @event tasksFetched
 * @description замена текущего списка задач на новый
 * @param {Task[]} payload массив задач, который заменит текущее состояние
 */
export const tasksFetched = createEvent<Task[]>();

/**
 * @store $tasks
 * @description массив всех задач
 * @type {Task[]}
 * @default []
 */
export const $tasks = createStore<Task[]>([]);

$tasks
  .on(addTask, (tasks, newTask) => {
    return [newTask, ...tasks];
  })
  .on(updateTask, (tasks, updatedTask) =>
    tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  )
  .on(deleteTask, (tasks, id) => tasks.filter((task) => task.id !== id))
  .on(tasksFetched, (_, newTasks) => newTasks);

/**
 * @function getTaskById
 * @description получение задачи по её идентификатору из текущего состояния хранилища
 * @param {number} id идентификатор задачи для поиска
 * @returns {Task | undefined} объект задачи, если найден, иначе undefined
 */
export const getTaskById = (id: number) => {
  return $tasks.getState().find((task) => task.id === id);
};
