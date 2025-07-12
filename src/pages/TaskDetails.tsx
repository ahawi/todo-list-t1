import {useState, useEffect} from 'react'
import {Form, Input, Select, Button, Space} from 'antd'
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
  const [taskExists, setTaskExists] = useState(false)

  useEffect(() => {
    if (id) {
      const task = getTaskById(Number(id))
      if (task) {
        form.setFieldsValue(task)
        setTaskExists(true)
      } else {
        navigate('/tasks')
      }
    }
  }, [id, getTaskById, form, navigate])

  const onFinish = (values: Task) => {
    if (id) {
      const updatedTask = {...values, id: Number(id)}
      onUpdateTask(updatedTask)
      navigate('/tasks')
    }
  }

  const onCancel = () => {
    navigate('/tasks')
  }

  return (
    <div className={styles.card__details}>
      <h2>Edit task</h2>
      <Form form={form} layout='vertical' onFinish={onFinish} initialValues={getTaskById(Number(id))}>
        <Form.Item name='title' label='Title' rules={[{required: true}]}>
          <Input />
        </Form.Item>

        <Form.Item name='description' label='Description'>
          <TextArea />
        </Form.Item>

        <Form.Item name='category' label='Category' rules={[{required: true}]}>
          <Select>
            <Option value='Bug'>Bug</Option>
            <Option value='Feature'>Feature</Option>
            <Option value='Documentation'>Documentation</Option>
            <Option value='Refactor'>Refactor</Option>
            <Option value='Test'>Test</Option>
          </Select>
        </Form.Item>

        <Form.Item name='status' label='Status' rules={[{required: true}]}>
          <Select>
            <Option value='To Do'>To Do</Option>
            <Option value='In Progress'>In Progress</Option>
            <Option value='Done'>Done</Option>
          </Select>
        </Form.Item>

        <Form.Item name='priority' label='Priority' rules={[{required: true}]}>
          <Select>
            <Option value='Low'>Low</Option>
            <Option value='Medium'>Medium</Option>
            <Option value='High'>High</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}
