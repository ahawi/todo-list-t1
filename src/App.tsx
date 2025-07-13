import {useState} from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import TaskList from './pages/TaskList'
import TaskDetails from './pages/TaskDetails'
import {type Task} from './types/Task'
import styles from './App.module.css'

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const getTaskById = (id: number): Task | undefined => {
    return tasks.find((t) => t.id === id)
  }

  const onUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks])
  }

  const TaskListWrapper = () => {
    const navigate = useNavigate()
    const handleEdit = (id: number) => {
      navigate(`/task/${id}`)
    }
    return <TaskList tasks={tasks} onDelete={handleDeleteTask} onEdit={handleEdit} onAddTask={handleAddTask} />
  }

  return (
    <Router basename='/todo-list-t1'>
      <div className={styles.app__container}>
        <Routes>
          <Route path='/' element={<TaskListWrapper />} />
          <Route path='/tasks' element={<TaskListWrapper />} />
          <Route path='/task/:id' element={<TaskDetails getTaskById={getTaskById} onUpdateTask={onUpdateTask} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
