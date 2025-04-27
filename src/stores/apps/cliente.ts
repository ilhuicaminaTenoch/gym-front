import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ClienteType } from '@/types/apps/ClienteTypes'
import {
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
} from '@/utils/helpers/cliente-service'

export const useClienteStore = defineStore('cliente', () => {
    const clientes = ref<ClienteType[]>([])
    const total = ref(0)
    const loading = ref(false)
    const filters = ref({
        nombre: '',
        email: '',
        telefono: ''
    })


    const loadClientes = async (page = 0, size = 10) => {
        loading.value = true
        try {
            const response = await fetchClientes(
                page,
                size,
                filters.value.nombre,
                filters.value.email,
                filters.value.telefono
            )
            clientes.value = response.content
            total.value = response.totalElements
        } catch (error) {
            console.error('Error al cargar clientes', error)
        } finally {
            loading.value = false
        }
    }

    const agregarCliente = async (nuevoCliente: Partial<ClienteType>) => {
        const cliente = await createCliente(nuevoCliente)
        clientes.value.push(cliente)
    }

    const editarCliente = async (cliente: Partial<ClienteType>) => {
        const actualizado = await updateCliente(cliente)
        const index = clientes.value.findIndex(c => c.id === actualizado.id)
        if (index > -1) {
            clientes.value[index] = actualizado
        }
    }

    const eliminarCliente = async (id: number) => {
        await deleteCliente(id)
        clientes.value = clientes.value.filter(c => c.id !== id)
    }

    return {
        clientes,
        total,
        loading,
        loadClientes,
        agregarCliente,
        editarCliente,
        eliminarCliente,
        filters
    }
})
