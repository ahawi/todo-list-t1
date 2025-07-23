import { Flex, Button, Popover } from 'antd'
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { CategoryPriorityFilters } from '../category-priority-filters/CategoryPriorityFilters'
import { DateTitleSorters } from '../date-title-sorters/DateTitleSorters'
import styles from './TaskControls.module.css'

/**
 * @function TaskControls
 * @description rомпонент, объединяющий все элементы управления задачами
 */
export function TaskControls() {
  const filterContent = (
    <div className={styles.controls__item}>
      <CategoryPriorityFilters />
    </div>
  )

  const sorterContent = (
    <div className={styles.controls__item}>
      <DateTitleSorters />
    </div>
  )

  return (
    <Flex justify="space-between" align="center" gap="small">
      <Flex gap="small" style={{ flexDirection: 'row' }}>
        <Popover content={filterContent} title="Filters" trigger="click" placement="bottomRight">
          <Button icon={<FilterOutlined />} size="middle" />
        </Popover>

        <Popover content={sorterContent} title="Sorting" trigger="click" placement="bottomRight">
          <Button icon={<SortAscendingOutlined />} size="middle" />
        </Popover>
      </Flex>
    </Flex>
  )
}
