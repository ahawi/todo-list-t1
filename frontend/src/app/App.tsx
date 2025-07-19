import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import TaskList from '@pages/task-list/TaskList'
import TaskForm from '@pages/task-form/TaskForm'

import { getTaskByIdFx, updateTaskFx, addTaskFx, deleteTaskFx, fetchTasksFx } from './store/tasks'
import styles from './App.module.css'
import { useEffect } from 'react'

const App = () => {
  /**
   * @function TaskListWrapper
   * @description компонент-обёртка для TaskList, управляющий навигацией и вызовом эффектов Effector
   * отвечает за инициализацию загрузки задач и передачу колбэков для редактирования, создания и удаления задач
   * @returns {JSX.Element} компонент TaskList с переданными пропсами
   */
  const TaskListWrapper = () => {
    const navigate = useNavigate()

    // эффект fetchTasksFx() вызывается один раз при первой загрузке или навигации на список задач,
    // чтобы получить актуальный список задач с сервера
    useEffect(() => {
      fetchTasksFx()
    }, [])

    /**
     * @callback handleEdit
     * @description навигация к форме редактирования конкретной задачи
     * @param {number} id - идентификатор задачи для редактирования
     */
    const handleEdit = (id: number) => {
      navigate(`/task/${id}`)
    }

    /**
     * @callback handleCreateNewTask
     * @description навигация к форме создания новой задачи
     */
    const handleCreateNewTask = () => {
      navigate('/task/new')
    }

    /**
     * @callback handleDeleteWrapper
     * @description удаление задачи
     * @param {number} id - идентификатор задачи, которую нужно удалить
     */
    const handleDeleteWrapper = async (id: number) => {
      await deleteTaskFx(id)
    }

    return <TaskList onDelete={handleDeleteWrapper} onEdit={handleEdit} onCreateNewTask={handleCreateNewTask} />
  }

  return (
    <Router basename="/todo-list-t1/">
      <div className={styles.app__container}>
        <Routes>
          <Route path="/" element={<TaskListWrapper />} />
          <Route path="/tasks" element={<TaskListWrapper />} />
          <Route
            path="/task/:id"
            element={<TaskForm getTaskById={getTaskByIdFx} onUpdateTask={updateTaskFx} onAddTask={addTaskFx} />}
          />
          <Route
            path="/task/new"
            element={
              <TaskForm
                getTaskById={getTaskByIdFx}
                onUpdateTask={updateTaskFx}
                onAddTask={addTaskFx}
                isNewTask={true}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App