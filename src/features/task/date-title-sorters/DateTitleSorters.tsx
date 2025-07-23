import { Select, Flex, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useUnit } from 'effector-react'
import { $selectedDateSort, dateSortChanged, $selectedTitleSort, titleSortChanged } from '@app/store/tasks'
import styles from './DateTitleSorters.module.css'

const { Option } = Select

/**
 * @function DateTitleSorters
 * @description компонент для сортировки задач по дате и названию
 */
export function DateTitleSorters() {
  const currentDateSort = useUnit($selectedDateSort)
  const currentTitleSort = useUnit($selectedTitleSort)

  const handleDateSortChange = (value: string) => {
    dateSortChanged(value)
  }

  const handleTitleSortChange = (value: string) => {
    titleSortChanged(value)
  }

  const handleResetSorters = () => {
    dateSortChanged('Date')
    titleSortChanged('Title')
  }

  return (
    <Flex gap="middle" align="center" vertical>
      <Select value={currentDateSort} onChange={handleDateSortChange} className={styles.sorters__select}>
        <Option disabled value="None">
          Date
        </Option>
        <Option value="Newest">Newest</Option>
        <Option value="Oldest">Oldest</Option>
      </Select>

      <Select value={currentTitleSort} onChange={handleTitleSortChange} className={styles.sorters__select}>
        <Option disabled value="None">
          Title
        </Option>
        <Option value="Az">From A to Z</Option>
        <Option value="Za">From Z to A</Option>
      </Select>

      <Button onClick={handleResetSorters} icon={<ReloadOutlined />} className={styles.sorters__button}>
        Reset sorting
      </Button>
    </Flex>
  )
}
