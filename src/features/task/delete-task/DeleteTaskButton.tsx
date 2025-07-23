import React from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useUnit } from 'effector-react'
import { deleteTaskFx } from '@app/store/tasks'

interface DeleteTaskButtonProps {
  taskId: number
}

export function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const handleDelete = useUnit(deleteTaskFx)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleDelete(taskId)
  }

  return <Button type="text" icon={<DeleteOutlined />} danger onClick={handleClick} />
}
