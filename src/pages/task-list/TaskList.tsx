import { Card, Flex, Spin } from 'antd'
import { useUnit } from 'effector-react'
import styles from './TaskList.module.css'
import { useEffect } from 'react'
import { fetchTasksFx } from '@app/store/tasks'
import { AddTaskButton } from '@/features/task/add-task/AddTaskButton'
import { TaskSearchInput } from '@/features/task/search/TaskSearchInput'
import { TaskListBoard } from '@/widgets/task-list-board/TaskListBoard'
import { LoadingSpinner } from '@/shared/ui/loading-spinner/LoadingSpinner'
import { TaskControls } from '@/features/task/controls/TaskControls'

export default function TaskList() {
  const isLoading = useUnit(fetchTasksFx.pending)

  useEffect(() => {
    fetchTasksFx()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles.tasklist}>
      <Card title="Task Manager" className={styles.tasklist__actions}>
        <div className={styles.tasklist__actionsTop}>
          <AddTaskButton />
          <Flex align="center" gap="small">
            <TaskSearchInput />
            <TaskControls />
          </Flex>
        </div>
      </Card>
      <TaskListBoard />
    </div>
  )
}
