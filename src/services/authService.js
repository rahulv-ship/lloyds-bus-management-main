import api from './api'

export const adminLogin = async (username, password) => {
  return (
    await api.post('/auth/login', {
      username,
      password,
    })
  ).data
}

// Employee login through Lloyds backend SSO
export const employeeSsoLogin = async (email, password) => {
  return (
    await api.post('/auth/employee-sso', {
      email,
      password,
    })
  ).data
}
