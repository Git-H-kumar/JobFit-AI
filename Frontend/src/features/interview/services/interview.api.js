import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

export async function generateInterview(formData) {
  const response = await api.post('/api/interview', formData)
  return response.data.interviewReport
}

export async function getInterview(interviewId) {
  const response = await api.get(`/api/interview/report/${interviewId}`)
  return response.data.interviewReport
}
