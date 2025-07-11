import {Checkbox, Button, Tag, Space} from 'antd'
import {DeleteOutlined, MoreOutlined} from '@ant-design/icons'

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
  onToggleComplete: (id: number) => void
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

export default function TaskItem({item, onDelete, onToggleComplete, onEdit}: TaskItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        marginBottom: '8px',
        backgroundColor: item.status === 'Done' ? '#f5f5f5' : 'white',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Checkbox
          checked={item.status === 'Done'}
          onChange={() => onToggleComplete(item.id)}
          style={{marginRight: '15px'}}
        />
        <div>
          <h4
            style={{
              margin: '0',
              textDecoration: item.status === 'Done' ? 'line-through' : 'none',
              color: item.status === 'Done' ? '#888' : '#333',
            }}
          >
            {item.title}
          </h4>
          <p
            style={{
              textDecoration: item.status === 'Done' ? 'line-through' : 'none',
              color: item.status === 'Done' ? '#808080' : '#333',
            }}
          >
            {item.description}
          </p>
          <div style={{marginTop: '5px'}}>
            <Tag color={getCategoryColor(item.category)} style={{marginRight: '8px'}}>
              {item.category}
            </Tag>
            <Tag color={getPriorityColor(item.priority)} style={{marginRight: '8px'}}>
              {item.priority}
            </Tag>
            <Tag>{item.status}</Tag>
          </div>
        </div>
      </div>
      <Space>
        <Button type='text' danger icon={<DeleteOutlined />} onClick={() => onDelete(item.id)} />
        <Button type='text' icon={<MoreOutlined />} onClick={() => onEdit(item.id)} />
      </Space>
    </div>
  )
}

