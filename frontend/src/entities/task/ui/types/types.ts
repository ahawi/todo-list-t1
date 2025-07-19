/**
 * @typedef {Object} Task
 * @description структура данных для задачи
 *
 * @property {number} id уникальный числовой идентификатор задачи, генерируется на сервере
 * @property {string} title заголовок задачи
 * @property {string} description описание задачи
 * @property {string} priority приоритет задачи
 * @property {string} category категория задачи
 * @property {string} status текущий статус задачи
 * @property {string} createdAt дата и время создания задачи
 */

export type Task = {
  id: number
  title: string
  description?: string
  priority: string
  category: string
  status: string
  createdAt: string
}
