import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TaskList from '@pages/task-list/TaskList'
import TaskForm from '@pages/task-form/TaskForm'

import { fetchTasksFx } from './store/tasks'
import styles from './App.module.css'
import { useEffect } from 'react'

const App = () => {
  /**
   * @function TaskListWrapper
   * @description компонент-обёртка для TaskList, управляющий навигацией и вызовом эффектов Effector
   * отвечает за инициализацию загрузки задач и передачу колбэков для редактирования, создания и удаления задач
   * @returns компонент TaskList с переданными пропсами
   */
  const TaskListWrapper = () => {
    // эффект fetchTasksFx() вызывается один раз при первой загрузке или навигации на список задач, чтобы получить актуальный список задач с сервера
    useEffect(() => {
      fetchTasksFx()
    }, [])

    return <TaskList />
  }

  return (
    <Router>
      <div className={styles.app__container}>
        <Routes>
          <Route path="/" element={<TaskListWrapper />} />
          <Route path="/tasks" element={<TaskListWrapper />} />
          <Route path="/task/:id" element={<TaskForm />} />
          <Route path="/task/new" element={<TaskForm isNewTask={true} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
