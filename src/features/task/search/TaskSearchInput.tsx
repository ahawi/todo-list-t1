import { Input } from 'antd'
import { useUnit } from 'effector-react'
import { $searchTerm, searchTermChanged } from '@app/store/tasks'
import styles from './TaskSearchInput.module.css'

export function TaskSearchInput() {
  const currentSearchTerm = useUnit($searchTerm)

  return (
    <Input
      className={styles.search}
      placeholder="Search task"
      value={currentSearchTerm}
      onChange={(e) => searchTermChanged(e.target.value)}
      allowClear
    />
  )
}
