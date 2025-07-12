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

  const todoTasks = tasks.filter((task) => task.status === 'To Do')
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress')
  const doneTasks = tasks.filter((task) => task.status === 'Done')

  const renderTaskList = (taskList: Task[], title: string) => (
    <Card title={title} style={{marginBottom: '20px', flex: '1', minWidth: '300px', margin: '0 8px'}}> 
      {taskList.length === 0 ? (
        <p style={{textAlign: 'center', color: '#888'}}>No tasks in this column.</p>
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={taskList}
          renderItem={(task) => (
            <List.Item key={task.id} style={{padding: '0', borderBottom: 'none'}}>
              <TaskItem
                item={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )

  return (
    <div
      style={{
        maxWidth: '1200px',
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

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          gap: '16px', 
        }}
      >
        {renderTaskList(todoTasks, 'To Do')}
        {renderTaskList(inProgressTasks, 'In Progress')}
        {renderTaskList(doneTasks, 'Done')}
      </div>
    </div>
  )
}