const BASE_URL = 'https://sheshanbackend-dbe6etbva0bchbhy.canadacentral-01.azurewebsites.net/api/Students'

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, options)
  const data = await parseResponse(response)

  if (!response.ok) {
    const message = typeof data === 'string' && data.trim().length > 0
      ? data
      : `Request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

export function getStudents() {
  return request(BASE_URL, {
    headers: { accept: 'application/json, text/plain, */*' },
  })
}

export function getStudentById(id) {
  return request(`${BASE_URL}/${id}`, {
    headers: { accept: 'application/json, text/plain, */*' },
  })
}

export function createStudent(student) {
  return request(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(student),
  })
}

export function updateStudent(id, student) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(student),
  })
}

export function deleteStudent(id) {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { accept: 'application/json, text/plain, */*' },
  })
}
