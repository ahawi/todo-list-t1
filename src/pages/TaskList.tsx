import {useState} from 'react'
import {Input, Select, Button, Card} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {type Task} from '../types/Task'
import styles from './TaskList.module.css'
import {RenderTaskList} from '../utils/renderTaskList'

const {Option} = Select
const {TextArea} = Input

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: number) => void
  onEdit: (id: number) => void
  onAddTask: (task: Task) => void
}

export default function TaskList({tasks, onDelete, onEdit, onAddTask}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState<string>('')
  const [newDescriptionText, setNewDescriptionText] = useState<string>('')
  const [newCategory, setNewCategory] = useState<Task['category']>('Feature')
  const [newPriority, setNewPriority] = useState<Task['priority']>('Medium')

  const handleDeleteTask = (id: number) => {
    onDelete(id)
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

  return (
    <div className={styles.tasklist}>
      <Card title='Add New Task' className={styles.tasklist__actions}>
        <div className={styles.tasklist__actionsInner}>
          <div className={styles.tasklist__actionsTop}>
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder='Enter new task title'
            onKeyDown={handleKeyDown}
          />
          <TextArea
            value={newDescriptionText}
            onChange={(e) => setNewDescriptionText(e.target.value)}
            placeholder='Enter new task description'
          /></div>
          <div className={styles.tasklist__actionsBottom}>
          <Select value={newCategory} onChange={(value) => setNewCategory(value as Task['category'])}>
            <Option value='Feature'>Feature</Option>
            <Option value='Bug'>Bug</Option>
            <Option value='Documentation'>Documentation</Option>
            <Option value='Refactor'>Refactor</Option>
            <Option value='Test'>Test</Option>
          </Select>
          <Select value={newPriority} onChange={(value) => setNewPriority(value as Task['priority'])}>
            <Option value='Low'>Low</Option>
            <Option value='Medium'>Medium</Option>
            <Option value='High'>High</Option>
          </Select>
          <Button type='primary' icon={<PlusOutlined />} onClick={handleAddNewTask}>
            Add Task
          </Button>
          </div>
        </div>
      </Card>

      <div className={styles.tasklist__lists}>
        <RenderTaskList taskList={todoTasks} title='To Do' onDelete={handleDeleteTask} onEdit={handleEditTask} />
        <RenderTaskList
          taskList={inProgressTasks}
          title='In Progress'
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
        <RenderTaskList taskList={doneTasks} title='Done' onDelete={handleDeleteTask} onEdit={handleEditTask} />
      </div>
    </div>
  )
}
