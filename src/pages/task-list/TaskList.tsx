import { Button, Card } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useUnit } from 'effector-react'
import styles from './TaskList.module.css'
import { RenderTaskList } from '@shared/lib/renderTaskList'
import { $tasks } from '@app/store/tasks'

/**
 * @interface TaskListProps
 * @property {(id: number) => Promise<void>} onDelete функция для удаления задачи
 * @property {(id: number) => void} onEdit функция для редактирования задачи
 * @property {() => void} onCreateNewTask функция для инициирования создания новой задачи
 */
interface TaskListProps {
  onDelete: (id: number) => Promise<void>
  onEdit: (id: number) => void
  onCreateNewTask: () => void
}

/**
 * @function TaskList
 * @description отображение списка задач, разделённых по статусам
 */
export default function TaskList({ onDelete, onEdit, onCreateNewTask }: TaskListProps) {
  const tasks = useUnit($tasks)
  const safeTasks = tasks || []

  /**
   * @function handleDeleteTask
   * @description удаление задачи
   * @param {number} id id задачи, которую нужно удалить
   */
  const handleDeleteTask = async (id: number) => {
    await onDelete(id)
  }

  /**
   * @function handleEditTask
   * @description редактирование задачи
   * @param {number} id id задачи, которую нужно редактировать
   */
  const handleEditTask = (id: number) => {
    onEdit(id)
  }

  // фильтрация задач по статусу для раздельного отображения
  const todoTasks = safeTasks.filter((task) => task.status === 'To Do')
  const inProgressTasks = safeTasks.filter((task) => task.status === 'In Progress')
  const doneTasks = safeTasks.filter((task) => task.status === 'Done')

  return (
    <div className={styles.tasklist}>
      <Card title="Task Manager" className={styles.tasklist__actions}>
        <div className={styles.tasklist__actionsInner}>
          <div className={styles.tasklist__actionsTop}>
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNewTask}>
              Add New Task
            </Button>
          </div>
        </div>
      </Card>

      <div className={styles.tasklist__lists}>
        <RenderTaskList taskList={todoTasks} title="To Do" onDelete={handleDeleteTask} onEdit={handleEditTask} />
        <RenderTaskList
          taskList={inProgressTasks}
          title="In Progress"
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
        <RenderTaskList taskList={doneTasks} title="Done" onDelete={handleDeleteTask} onEdit={handleEditTask} />
      </div>
    </div>
  )
}
