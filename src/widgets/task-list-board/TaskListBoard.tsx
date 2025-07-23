import { Card, Empty } from 'antd'
import { useUnit } from 'effector-react'
import { useNavigate } from 'react-router-dom'

import { $displayedTasks, $searchTerm } from '@app/store/tasks'

import { RenderTaskList } from '@shared/lib/renderTaskList'
import styles from './TaskListBoard.module.css'

export function TaskListBoard() {
  const navigate = useNavigate()

  const displayedTasks = useUnit($displayedTasks)
  const currentSearchTerm = useUnit($searchTerm)

  const handleEditTask = (id: number) => {
    navigate(`/task/${id}`)
  }

  const todoTasks = displayedTasks.filter((task) => task.status === 'To Do')
  const inProgressTasks = displayedTasks.filter((task) => task.status === 'In Progress')
  const doneTasks = displayedTasks.filter((task) => task.status === 'Done')

  const emptyDescription =
    displayedTasks.length === 0 && !currentSearchTerm
      ? 'No tasks have been created yet. Add your first task!'
      : `No tasks found matching the query "${currentSearchTerm}"`

  const emptyImage = '/empty-icon.png'

  return (
    <>
      {displayedTasks.length === 0 ? (
        <Card className={styles.taskListBoard__emptyStateCard}>
          <Empty image={emptyImage} description={emptyDescription} />
        </Card>
      ) : (
        <div className={styles.taskListBoard__lists}>
          <RenderTaskList taskList={todoTasks} title="To Do" onEdit={handleEditTask} />
          <RenderTaskList taskList={inProgressTasks} title="In Progress" onEdit={handleEditTask} />
          <RenderTaskList taskList={doneTasks} title="Done" onEdit={handleEditTask} />
        </div>
      )}
    </>
  )
}
