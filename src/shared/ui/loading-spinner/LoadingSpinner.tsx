import { Spin, Flex } from 'antd'
import styles from './LoadingSpinner.module.css'

export function LoadingSpinner() {
  return (
    <Flex justify="center" align="center" className={styles.spinnerWrapper}>
      <Spin size="large" />
    </Flex>
  )
}
