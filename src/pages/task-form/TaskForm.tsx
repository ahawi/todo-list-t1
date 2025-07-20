import { useState, useEffect, useRef } from 'react'
import { Form, Input, Select, Button, Flex, Card, message, Spin } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { parseISO, format } from 'date-fns'

import styles from './TaskForm.module.css'
import { type Task } from '@entities/task/ui/types/types'

const { Option } = Select
const { TextArea } = Input

/**
 * @interface TaskFormProps
 * @property {(id: number) => Promise<Task | undefined>} getTaskById функция для получения данных задачи по её id. Возвращает промис с объектом задачи или undefined
 * @property {(task: Task) => Promise<Task>} onUpdateTask функция для обновления существующей задачи. Принимает полный объект задачи и возвращает промис с обновлённой задачей
 * @property {(task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>} onAddTask функция для добавления новой задачи. Принимает данные задачи без id и createdAt, возвращает промис с созданной задачей
 * @property {boolean} [isNewTask=false] - Флаг, указывающий, что форма используется для создания новой задачи (true) или для редактирования существующей (false)
 */
interface TaskFormProps {
  getTaskById: (id: number) => Promise<Task | undefined>
  onUpdateTask: (task: Task) => Promise<Task>
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>
  isNewTask?: boolean
}

/**
 * @function TaskForm
 * @description компонент формы для создания или редактирования задачи, загружает данные существующей задачи по id из URL или инициализирует форму для новой задачи
 */
export default function TaskForm({ getTaskById, onUpdateTask, onAddTask, isNewTask }: TaskFormProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // гарантируется, что form.setFieldsValue во втором useEffect всегда будет использовать актуальные данные, даже если currentTask ещё не обновился
  const fetchedTaskRef = useRef<Task | undefined>(undefined)

  useEffect(() => {
    const loadTaskData = async () => {
      setLoading(true)
      if (isNewTask) {
        form.setFieldsValue({
          title: '',
          description: '',
          category: 'Feature',
          status: 'To Do',
          priority: 'Medium',
        })
        setCurrentTask(undefined)
        setLoading(false)
      } else if (id) {
        try {
          const taskId = Number(id)
          const task = await getTaskById(taskId)
          if (task) {
            fetchedTaskRef.current = task
            setCurrentTask(task)
          } else {
            message.error('Task not found!')
            navigate('/tasks')
          }
        } catch (error) {
          console.error('Error loading task:', error)
          message.error('Error loading task.')
          navigate('/tasks')
        } finally {
          setLoading(false)
        }
      }
    }

    loadTaskData()
  }, [id, getTaskById, form, navigate, isNewTask])

  /**
   * @useEffect
   * @description установки значений формы после загрузки данных задачи
   */
  useEffect(() => {
    if (!isNewTask && !loading && fetchedTaskRef.current) {
      form.setFieldsValue({
        title: fetchedTaskRef.current.title,
        description: fetchedTaskRef.current.description,
        category: fetchedTaskRef.current.category,
        status: fetchedTaskRef.current.status,
        priority: fetchedTaskRef.current.priority,
      })

      // предотвращение повторной установки значений формы, если компонент перерендерится по каким-либо причинам, но без изменения id или isNewTask
      fetchedTaskRef.current = undefined
    }
  }, [loading, isNewTask, form])

  /**
   * @function onFinish
   * @description обработчик отправки формы, отправляет данные для создания или обновления задачи через переданные пропсы onAddTask или onUpdateTask
   */
  const onFinish = async (values: Task) => {
    setIsSaving(true)
    try {
      const taskDataToSend = {
        title: values.title,
        description: values.description,
        category: values.category,
        status: values.status,
        priority: values.priority,
      } as Omit<Task, 'id' | 'createdAt'> // убеждаемся, что отправляем только нужные поля

      if (isNewTask) {
        await onAddTask(taskDataToSend)
        message.success('Task created successfully!')
      } else if (currentTask && id) {
        const updatedTask: Task = {
          ...taskDataToSend,
          id: Number(id),
          createdAt: currentTask.createdAt, // createdAt берется из текущей задачи
        }
        await onUpdateTask(updatedTask)
        message.success('Task updated successfully!')
      }
      navigate('/tasks')
    } catch (error) {
      message.error('Error saving task.')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * @function onCancel
   * @description перенаправление пользователя обратно к списку задач
   */
  const onCancel = () => {
    navigate('/tasks')
  }

  const formTitle = isNewTask ? 'Create new task' : 'Edit task'

  // лоадер
  if (loading && !isNewTask) {
    return (
      <Card className={styles.card__details}>
        <div className={styles.card__detailsSpinWrap}>
          <Spin size="large">
            <div className={styles.card__detailsSpin} />
          </Spin>
        </div>
      </Card>
    )
  }

  return (
    <Card title={formTitle} className={styles.card__details}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ category: 'Feature', status: 'To Do', priority: 'Medium' }}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the task title!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea autoSize={{ minRows: 2 }} />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select>
            <Option value="Bug">Bug</Option>
            <Option value="Feature">Feature</Option>
            <Option value="Documentation">Documentation</Option>
            <Option value="Refactor">Refactor</Option>
            <Option value="Test">Test</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status!' }]}>
          <Select>
            <Option value="To Do">To Do</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Done">Done</Option>
          </Select>
        </Form.Item>

        <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Please select a priority!' }]}>
          <Select>
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>

        {!isNewTask && (
          <Form.Item label="Created At">
            <Input
              value={currentTask?.createdAt ? format(parseISO(currentTask.createdAt), 'dd.MM.yyyy HH:mm:ss') : ''}
              disabled
            />
          </Form.Item>
        )}

        <Form.Item className={styles.card__buttons}>
          <Flex gap="small" justify="flex-end">
            <Button type="primary" htmlType="submit" loading={isSaving}>
              Save
            </Button>
            <Button onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Card>
  )
}
