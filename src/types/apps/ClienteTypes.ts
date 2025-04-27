export interface ClienteType {
    id: number
    nombre: string
    apellidos: string
    fechaNacimiento: string
    email: string
    telefono: string
    direccion: string
}

export interface ClienteResponse {
    content: ClienteType[]
    totalElements: number
    totalPages: number
    number: number      // página actual (base 0)
    size: number        // tamaño de página
    first: boolean
    last: boolean
    numberOfElements: number
    empty: boolean
}