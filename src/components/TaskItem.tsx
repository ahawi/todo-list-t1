import {Button, Tag} from 'antd'
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'
import styles from './TaskItem.module.css'

interface Task {
  id: number
  title: string
  description?: string
  category: 'Bug' | 'Feature' | 'Documentation' | 'Refactor' | 'Test'
  status: 'To Do' | 'In Progress' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
}

interface TaskItemProps {
  item: Task
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

const getCategoryColor = (category: Task['category']) => {
  switch (category) {
    case 'Bug':
      return 'red'
    case 'Feature':
      return 'blue'
    case 'Documentation':
      return 'geekblue'
    case 'Refactor':
      return 'purple'
    case 'Test':
      return 'green'
    default:
      return 'default'
  }
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'High':
      return 'red'
    case 'Medium':
      return 'orange'
    case 'Low':
      return 'green'
    default:
      return 'default'
  }
}

export default function TaskItem({item, onDelete, onEdit}: TaskItemProps) {
  const MAX_DESCRIPTION_LENGTH = 30
  const displayDescription =
    item.description && item.description.length > MAX_DESCRIPTION_LENGTH
      ? item.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
      : item.description
  return (
    <div className={`${styles.card__container} ${item.status === 'Done' ? styles.card__done : ''}`}>
      <div className={styles.card__inner}>
        <div>
          <h4 className={`${styles.card__title} ${item.status === 'Done' ? styles.card__done : ''}`}>{item.title}</h4>
          <p className={styles.card__description}>{displayDescription}</p>
          <div className={styles.card__tags}>
            <Tag color={getCategoryColor(item.category)}>{item.category}</Tag>
            <Tag color={getPriorityColor(item.priority)}>{item.priority}</Tag>
            <Tag>{item.status}</Tag>
          </div>
        </div>
      </div>
      <div className={styles.card__actions}>
        <Button type='text' danger icon={<DeleteOutlined />} onClick={() => onDelete(item.id)} />
        <Button type='text' icon={<EditOutlined />} onClick={() => onEdit(item.id)} />
      </div>
    </div>
  )
}
