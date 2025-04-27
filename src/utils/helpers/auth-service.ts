import api from '@/utils/axios'

interface LoginPayload {
    usernameOrEmail: string
    password: string
}

export const loginUsuario = async (payload: LoginPayload) => {
    const { data } = await api.post('/login', payload)
    return data
}
