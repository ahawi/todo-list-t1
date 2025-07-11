import {useState} from 'react'
import TaskItem from '../components/TaskItem'
import {Input, Select, Button, List, Space, Card} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {type Task} from '../types/Task'

const {Option} = Select

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: number) => void
  onToggleComplete: (id: number) => void
  onEdit: (id: number) => void
  onAddTask: (task: Task) => void
}

export default function TaskList({tasks, onDelete, onToggleComplete, onEdit, onAddTask}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState<string>('')
  const [newDescriptionText, setNewDescriptionText] = useState<string>('')
  const [newCategory, setNewCategory] = useState<Task['category']>('Feature')
  const [newPriority, setNewPriority] = useState<Task['priority']>('Medium')

  const handleDeleteTask = (id: number) => {
    onDelete(id)
  }

  const handleToggleComplete = (id: number) => {
    onToggleComplete(id)
  }

  const handleEditTask = (id: number) => {
    onEdit(id)
  }

  const handleAddNewTask = () => {
    if (newTaskText.trim() === '') {
      return
    }

    const newTask: Task = {
      id: Date.now(),
      title: newTaskText,
      description: newDescriptionText,
      category: newCategory,
      status: 'To Do',
      priority: newPriority,
    }

    onAddTask(newTask)
    setNewTaskText('')
    setNewDescriptionText('')
    setNewCategory('Feature')
    setNewPriority('Medium')
  }

  const handleKeyDown = (e: {key: string}) => {
    if (e.key === 'Enter') {
      handleAddNewTask()
    }
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Card title='Add New Task' style={{marginBottom: '30px'}}>
        <Space direction='horizontal' style={{width: '100%', justifyContent: 'space-between', flexWrap: 'wrap'}}>
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder='Enter new task title'
            style={{flex: '2 1 200px'}}
            onKeyDown={handleKeyDown}
          />
          <Input
            value={newDescriptionText}
            onChange={(e) => setNewDescriptionText(e.target.value)}
            placeholder='Enter new task description'
            style={{flex: '2 1 200px'}}
          />
          <Select
            value={newCategory}
            onChange={(value) => setNewCategory(value as Task['category'])}
            style={{flex: '1 1 120px'}}
          >
            <Option value='Feature'>Feature</Option>
            <Option value='Bug'>Bug</Option>
            <Option value='Documentation'>Documentation</Option>
            <Option value='Refactor'>Refactor</Option>
            <Option value='Test'>Test</Option>
          </Select>
          <Select
            value={newPriority}
            onChange={(value) => setNewPriority(value as Task['priority'])}
            style={{flex: '1 1 120px'}}
          >
            <Option value='Low'>Low</Option>
            <Option value='Medium'>Medium</Option>
            <Option value='High'>High</Option>
          </Select>
          <Button type='primary' icon={<PlusOutlined />} onClick={handleAddNewTask} style={{flex: '0 0 auto'}}>
            Add Task
          </Button>
        </Space>
      </Card>
      {tasks.length === 0 ? (
        <p style={{textAlign: 'center', color: '#888'}}>No tasks to display.</p>
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item key={task.id} style={{padding: '0', borderBottom: 'none'}}>
              <TaskItem
                item={task}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )
}
