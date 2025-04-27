import api from '@/utils/axios'

interface UsuarioRegistro {
    username: string
    email: string
    password: string
}

export const registrarUsuario = async (datos: UsuarioRegistro) => {
    const { data } = await api.post('/usuarios', datos)
    return data
}
