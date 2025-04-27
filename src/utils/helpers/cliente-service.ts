import api from '@/utils/axios'
import type { ClienteType, ClienteResponse } from '@/types/apps/ClienteTypes'


export const fetchClientes = async (
    page = 0,
    size = 10,
    nombre = '',
    email = '',
    telefono = ''
): Promise<ClienteResponse> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    if (nombre) params.append('nombre', nombre)
    if (email) params.append('email', email)
    if (telefono) params.append('telefono', telefono)

    const { data } = await api.get<ClienteResponse>(`/clientes?${params}`)
    return data
}

export const createCliente = async (cliente: Partial<ClienteType>) => {
    const { data } = await api.post<ClienteType>('/clientes', cliente)
    return data
}

export const updateCliente = async (cliente: Partial<ClienteType>) => {
    const { data } = await api.put<ClienteType>('/clientes', cliente)
    return data
}

export const deleteCliente = async (id: number) => {
    await api.delete(`/clientes/${id}`);
}