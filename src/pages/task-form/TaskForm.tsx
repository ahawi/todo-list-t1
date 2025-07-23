import { useState, useEffect, useRef } from 'react'
import { Form, Input, Select, Button, Flex, Card, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { parseISO, format } from 'date-fns'
import styles from './TaskForm.module.css'
import { type Task } from '@entities/task/ui/types/types'
import { addTaskFx, getTaskByIdFx, updateTaskFx } from '@/app/store/tasks'
import { useUnit } from 'effector-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner/LoadingSpinner'

const { Option } = Select
const { TextArea } = Input

/**
 * @function TaskForm
 * @description компонент формы для создания или редактирования задачи, загружает данные существующей задачи по id из URL или инициализирует форму для новой задачи
 */
export default function TaskForm({ isNewTask }: { isNewTask?: boolean }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const getTaskById = useUnit(getTaskByIdFx)
  const addTask = useUnit(addTaskFx)
  const updateTask = useUnit(updateTaskFx)

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
            navigate('/')
          }
        } catch (error) {
          message.error('Error loading task.')
          navigate('/')
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
      }

      if (isNewTask) {
        await addTask(taskDataToSend)
        message.success('Task created successfully!')
      } else if (currentTask && id) {
        const updatedTask: Task = {
          ...taskDataToSend,
          id: Number(id),
          createdAt: currentTask.createdAt,
        }
        await updateTask(updatedTask)
        message.success('Task updated successfully!')
      }
      navigate('/')
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
    navigate('/')
  }

  const formTitle = isNewTask ? 'Create new task' : 'Edit task'

  // лоадер
  if (loading && !isNewTask) {
    return <LoadingSpinner />
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
