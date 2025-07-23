import { Select, Flex, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useUnit } from 'effector-react'
import { $selectedCategory, categoryFilterChanged, $selectedPriority, priorityFilterChanged } from '@app/store/tasks'
import styles from './CategoryPriorityFilters.module.css'

const { Option } = Select

/**
 * @function CategoryPriorityFilters
 * @description компонент для фильтрации задач по категории и приоритету
 */
export function CategoryPriorityFilters() {
  const currentCategory = useUnit($selectedCategory)
  const currentPriority = useUnit($selectedPriority)

  const handleCategoryChange = (value: string) => {
    categoryFilterChanged(value)
  }

  const handlePriorityChange = (value: string) => {
    priorityFilterChanged(value)
  }

  const handleResetFilters = () => {
    categoryFilterChanged('All')
    priorityFilterChanged('All')
  }

  return (
    <Flex gap="middle" vertical align="center">
      <Select value={currentCategory} onChange={handleCategoryChange} className={styles.filtres__select}>
        <Option value="All">All categories</Option>
        <Option value="Bug">Bug</Option>
        <Option value="Feature">Feature</Option>
        <Option value="Documentation">Documentation</Option>
        <Option value="Refactor">Refactor</Option>
        <Option value="Test">Test</Option>
      </Select>

      <Select value={currentPriority} onChange={handlePriorityChange} className={styles.filtres__select}>
        <Option value="All">All priorities</Option>
        <Option value="Low">High</Option>
        <Option value="Medium">Medium</Option>
        <Option value="High">High</Option>
      </Select>

      <Button onClick={handleResetFilters} icon={<ReloadOutlined />} className={styles.filters__button}>
        Reset filters
      </Button>
    </Flex>
  )
}
