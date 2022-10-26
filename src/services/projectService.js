import { errorMessage } from '@/utils/errorMessage'

export const projectServiceFactory = () => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charsert=utf-8'
  }

  const options = { headers }

  const api = 'http://localhost:3000'

  const getProjects = async () => {
    const method = 'GET'
    const error = 'EndPoint not exists, status:404'
    try {
      const response = await fetch(`${api}/projects/`, { ...options, method })
      if (response.status && response.status === 404) {
        errorMessage.emit('project-error', {
          message:
            'Ocorreu um erro ao tentar obter os projetos. Tente novamente mais tarde.'
        })
        throw new Error(error)
      }
      return await response.json()
    } catch (error) {
      console.error('getProgects Error', error)
    }
  }
  const getTasks = async (projectId) => {
    return fetch(`${api}/tasks?projectId=${projectId}`, { ...options })
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

  const createProject = async (title) => {
    const method = 'POST'
    const body = JSON.stringify({ title })
    try {
      const response = await fetch(`${api}/projects`, {
        ...options,
        method,
        body
      })

      return await response.json()
    } catch (error) {
      console.log('Error createProject', error)
    }
  }
  const updateProject = async (title, id) => {
    const method = 'PUT'
    const body = JSON.stringify({ title })
    try {
      const response = await fetch(`${api}/projects/${id}`, {
        ...options,
        method,
        body
      })

      return await response.json()
    } catch (error) {
      console.log('Error updateProject', error)
    }
  }
  const createTask = async ({ projectId, description }) => {
    if (!projectId || !description) return

    const method = 'POST'
    const body = JSON.stringify({
      description,
      projectId
    })
    try {
      const response = await fetch(`${api}/tasks`, {
        ...options,
        method,
        body
      })

      return await response.json()
    } catch (error) {
      console.log('Error creteTask', error)
    }
  }
  const updateTask = async ({ id, projectId, description }) => {
    if (!id || !projectId || !description) {
      throw new Error('ID, DESCRIPTION and PROJECTID not exists and must be.')
    }

    const method = 'PUT'
    const body = JSON.stringify({ projectId, description })
    try {
      const response = await fetch(`${api}/tasks/${id}`, {
        ...options,
        method,
        body
      })

      return await response.json()
    } catch (error) {
      console.log('Error updateTask', error)
    }
  }
  const removeProjects = async (projectIds) => {
    const method = 'DELETE'
    try {
      const requests = projectIds.map(async (projectId) => {
        return await fetch(`${api}/projects/${projectId}`, {
          ...options,
          method
        })
      })

      return await Promise.all([requests])
    } catch (error) {
      console.log('Error removeProject', error)
    }
  }
  const removeTasks = async (taskIds) => {
    const method = 'DELETE'

    try {
      const requests = taskIds.map(async (taskId) => {
        return await fetch(`${api}/tasks/${taskId}`, {
          ...options,
          method
        })
      })

      return await Promise.all([requests])
    } catch (error) {
      console.log('Error removeTask', error)
    }
  }

  return {
    getProjects,
    getTasks,
    createProject,
    updateProject,
    updateTask,
    createTask,
    removeProjects,
    removeTasks
  }
}
