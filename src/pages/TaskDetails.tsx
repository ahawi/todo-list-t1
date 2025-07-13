import {useState, useEffect} from 'react'
import {Form, Input, Select, Button, Flex, Card} from 'antd'
import {useParams, useNavigate} from 'react-router-dom'
import styles from './TaskDetails.module.css'
import {type Task} from '../types/Task'

const {Option} = Select
const {TextArea} = Input

interface TaskDetailsProps {
  getTaskById: (id: number) => Task | undefined
  onUpdateTask: (task: Task) => void
}

export default function TaskDetails({getTaskById, onUpdateTask}: TaskDetailsProps) {
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task>()

  useEffect(() => {
    if (id) {
      const task = getTaskById(Number(id))
      if (task) {
        form.setFieldsValue(task)
        setCurrentTask(task)
      } else {
        navigate('/tasks')
      }
    }
  }, [id, getTaskById, form, navigate])

  const onFinish = (values: Task) => {
    if (id) {
      const updatedTask = {...values, id: Number(id)}
      onUpdateTask(updatedTask)
      setCurrentTask(updatedTask)
      setIsEditing(false)
    }
  }

  const onCancel = () => {
    if (currentTask) {
      form.setFieldsValue(currentTask)
    }
    setIsEditing(false)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleBackClick = () => {
    navigate('/tasks')
  }

  if (!currentTask) {
    return <Card className={styles.card__details}>Loading task...</Card>
  }

  return (
    <Card title={isEditing ? 'Edit Task' : 'Task Details'} className={styles.card__details}>
      <Form form={form} layout='vertical' onFinish={onFinish} initialValues={currentTask}>
        <Form.Item name='title' label='Title' rules={[{required: true}]}>
          {isEditing ? <Input /> : <p>{currentTask.title}</p>}
        </Form.Item>

        {(isEditing || (currentTask.description && currentTask.description.trim() !== '')) && (
          <Form.Item name='description' label='Description'>
            {isEditing ? <TextArea autoSize={{minRows: 2}} /> : <p>{currentTask.description}</p>}
          </Form.Item>
        )}
        <Form.Item name='category' label='Category' rules={[{required: true}]}>
          {isEditing ? (
            <Select>
              <Option value='Bug'>Bug</Option>
              <Option value='Feature'>Feature</Option>
              <Option value='Documentation'>Documentation</Option>
              <Option value='Refactor'>Refactor</Option>
              <Option value='Test'>Test</Option>
            </Select>
          ) : (
            <p>{currentTask.category}</p>
          )}
        </Form.Item>

        <Form.Item name='status' label='Status' rules={[{required: true}]}>
          {isEditing ? (
            <Select>
              <Option value='To Do'>To Do</Option>
              <Option value='In Progress'>In Progress</Option>
              <Option value='Done'>Done</Option>
            </Select>
          ) : (
            <p>{currentTask.status}</p>
          )}
        </Form.Item>

        <Form.Item name='priority' label='Priority' rules={[{required: true}]}>
          {isEditing ? (
            <Select>
              <Option value='Low'>Low</Option>
              <Option value='Medium'>Medium</Option>
              <Option value='High'>High</Option>
            </Select>
          ) : (
            <p>{currentTask.priority}</p>
          )}
        </Form.Item>

        <Flex gap='small' justify='flex-end'>
          {!isEditing && (
            <Button type='primary' onClick={handleEditClick}>
              Edit
            </Button>
          )}
          {!isEditing && (
            <Button style={{border: 'none'}} onClick={handleBackClick}>
              Back to List
            </Button>
          )}
        </Flex>

        {isEditing && (
          <Form.Item className={styles.card__buttons}>
            <Flex gap='small' justify='flex-end'>
              <Button type='primary' htmlType='submit'>
                Save
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </Flex>
          </Form.Item>
        )}
      </Form>
    </Card>
  )
}
