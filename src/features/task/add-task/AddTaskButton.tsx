import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export function AddTaskButton() {
  const navigate = useNavigate()

  const handleCreateNewTask = () => {
    navigate('/task/new')
  }

  return (
    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNewTask}>
      Add New Task
    </Button>
  )
}
