import {List, Card} from 'antd'
import {type Task} from '../types/Task'
import TaskItem from '../components/TaskItem'
import styles from '../pages/TaskList.module.css'

interface RenderTaskListProps {
  taskList: Task[]
  title: string
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export function RenderTaskList({taskList, title, onDelete, onEdit}: RenderTaskListProps) {
  return (
    <Card title={title} className={styles.tasklist__card}>
      {taskList.length === 0 ? (
        <p className={styles.tasklist__cardTitle}>No tasks in this column.</p>
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={taskList}
          renderItem={(task) => (
            <List.Item key={task.id} className={styles.tasklist__cardInner}>
              <TaskItem item={task} onDelete={onDelete} onEdit={onEdit} />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}
