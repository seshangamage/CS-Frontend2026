import { useMemo, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from './api'

const initialStudent = {
  id: '',
  name: '',
  age: '',
  email: '',
}

function App() {
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [form, setForm] = useState(initialStudent)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const canSubmitForm = useMemo(() => {
    return form.name.trim() && form.email.trim()
  }, [form.email, form.name])

  const resetFeedback = () => {
    setError('')
    setMessage('')
  }

  const handleLoadAll = async () => {
    resetFeedback()
    setLoading(true)
    try {
      const data = await getStudents()
      setStudents(Array.isArray(data) ? data : [])
      setMessage('Students loaded successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGetById = async () => {
    if (!studentId) {
      setError('Enter a student ID first.')
      return
    }

    resetFeedback()
    setLoading(true)
    try {
      const data = await getStudentById(studentId)
      setStudents(data ? [data] : [])
      setMessage(`Student ${studentId} loaded.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!canSubmitForm) {
      setError('Name and email are required.')
      return
    }

    resetFeedback()
    setLoading(true)
    try {
      await createStudent({
        name: form.name,
        age: Number(form.age || 0),
        email: form.email,
      })
      setMessage('Student created successfully.')
      await handleLoadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!form.id) {
      setError('Enter a student ID in form to update.')
      return
    }

    resetFeedback()
    setLoading(true)
    try {
      await updateStudent(form.id, {
        id: Number(form.id),
        name: form.name,
        age: Number(form.age),
        email: form.email,
      })
      setMessage(`Student ${form.id} updated successfully.`)
      await handleLoadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) {
      setError('Enter a student ID to delete.')
      return
    }

    resetFeedback()
    setLoading(true)
    try {
      await deleteStudent(deleteId)
      setMessage(`Student ${deleteId} deleted successfully.`)
      setDeleteId('')
      await handleLoadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <main className="app">
      <h1>Student CRUD App</h1>

      <div className="actions">
        <button onClick={handleLoadAll} disabled={loading}>Load All Students</button>
        <div className="inline-group">
          <input
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button onClick={handleGetById} disabled={loading}>Get By ID</button>
        </div>
      </div>

      <form className="form" onSubmit={handleCreate}>
        <h2>Create / Update Student</h2>
        <input name="id" type="number" placeholder="ID" value={form.id} onChange={onFormChange} />
        <input name="name" placeholder="Name" value={form.name} onChange={onFormChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={onFormChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onFormChange} />
        <div className="inline-group">
          <button type="submit" disabled={loading}>Create</button>
          <button type="button" onClick={handleUpdate} disabled={loading}>Update</button>
        </div>
      </form>

      <div className="delete-box">
        <h2>Delete Student</h2>
        <div className="inline-group">
          <input
            placeholder="Student ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />
          <button onClick={handleDelete} disabled={loading}>Delete</button>
        </div>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <section>
        <h2>Students</h2>
        {students.length === 0 ? (
          <p>No students to show.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default App
