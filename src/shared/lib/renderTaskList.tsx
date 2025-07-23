import { List, Card } from 'antd'
import { type Task } from '@entities/task/ui/types/types'
import TaskItem from '@/entities/task/ui/task-item/TaskItem'
import styles from '@pages/task-list/TaskList.module.css'

/**
 * @interface RenderTaskListProps
 * @property {Task[]} taskList массив задач для отображения в конкретном списке
 * @property {string} title заголовок для карточки списка задач
 * @property {(id: number) => void} onDelete колбэк, вызываемый при запросе на удаление задачи
 * @property {(id: number) => void} onEdit колбэк, вызываемый при клике на элемент задачи для редактирования
 */
interface RenderTaskListProps {
  taskList: Task[]
  title: string
  onEdit: (id: number) => void
}

/**
 * @function RenderTaskList
 * @description компонент, который используется для отображения задач, сгруппированных по статусу
 */
export function RenderTaskList({ taskList, title, onEdit }: RenderTaskListProps) {
  return (
    <Card title={title} className={styles.tasklist__card}>
      {taskList.length === 0 ? (
        <p className={styles.tasklist__cardTitle}>No tasks in this column</p>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={taskList}
          renderItem={(task) => (
            <List.Item key={task.id} className={styles.tasklist__cardInner}>
              <TaskItem item={task} onEdit={onEdit} />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}
