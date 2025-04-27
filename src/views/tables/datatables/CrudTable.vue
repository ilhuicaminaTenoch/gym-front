<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, reactive } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useClienteStore } from '@/stores/apps/cliente';

const clientesStore = useClienteStore();

const page = ref({ title: 'Clientes' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Clientes',
        disabled: true,
        href: '#'
    }
]);

const dialog = ref(false)
const dialogDelete = ref(false)
const itemsPerPage = ref(10)
const headers = ref([
    {
        title: 'Nombre',
        align: 'start',
        sortable: false,
        key: 'nombre',
    },
    { title: 'Apellidos', key: 'apellido' },
    { title: 'Email', key: 'email' },
    { title: 'Telefono', key: 'telefono' },
    { title: 'Actiones', key: 'actiones', sortable: false },
])
const multiSearch = reactive({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
})

const editedIndex = ref(-1)
const editedItem = ref({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
})
const defaultItem = ref({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
})
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Nuevo Cliente' : 'Editar Cliente';
})

function editItem(item) {
    editedIndex.value = clientesStore.clientes.findIndex(cliente => cliente.id === item.id)
    editedItem.value = { ...item }
    dialog.value = true
}
function deleteItem(item) {
    editedIndex.value = clientesStore.clientes.findIndex(cliente => cliente.id === item.id)
    editedItem.value = { ...item }
    dialogDelete.value = true
}
async function deleteItemConfirm() {
    try {
        if (editedItem.value.id) {
            await clientesStore.eliminarCliente(editedItem.value.id)
        }
    } catch (error) {
        console.error('Error eliminando cliente', error)
    } finally {
        closeDelete()
    }
}
function close() {
    dialog.value = false
    nextTick(() => {
        editedItem.value = { ...defaultItem.value }
        editedIndex.value = -1
    })
}
function closeDelete() {
    dialogDelete.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
    })
}
async function save() {
    try {
        if (editedIndex.value > -1 && editedItem.value.id) {
            await clientesStore.editarCliente(editedItem.value)
        } else {
            await clientesStore.agregarCliente(editedItem.value)
        }
    } catch (error) {
        console.error('Error guardando cliente', error)
    } finally {
        close()
    }
}
watch(dialog, val => {
    val || close()
})
watch(dialogDelete, val => {
    val || closeDelete()
})
const loadClientes = async ({ page, itemsPerPage, sortBy }: any) => {
    try {
        await clientesStore.loadClientes(page - 1, itemsPerPage) // backend espera base 0
    } finally {
        clientesStore.loading = false
    }
}
onMounted(() => {
    loadClientes({ page: 1, itemsPerPage: itemsPerPage.value })
})

const showFilters = ref(false)
const aplicarFiltros = () => {
    clientesStore.filters.nombre = multiSearch.nombre
    clientesStore.filters.email = multiSearch.email
    clientesStore.filters.telefono = multiSearch.telefono
    clientesStore.loadClientes(0, itemsPerPage.value)
}

const limpiarFiltros = () => {
    multiSearch.nombre = ''
    multiSearch.apellido = ''
    multiSearch.email = ''
    multiSearch.telefono = ''
    aplicarFiltros()
}

</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Crud Table">
                <v-data-table-server
                    class="border rounded-md crud-tbl"
                    :v-model:items-per-page="itemsPerPage"
                    :headers="headers"
                    :items="clientesStore.clientes"
                    :items-length="clientesStore.total"
                    :loading="clientesStore.loading"
                    item-value="id"
                    @update:options="loadClientes"
                >
                    <template v-slot:top>
                        <v-btn color="primary" @click="showFilters = !showFilters" class="mb-4">
                            {{ showFilters ? 'Ocultar Filtros' : 'Filtro' }}
                        </v-btn>

                        <v-expand-transition>
                            <v-card v-if="showFilters" class="mb-4 pa-4" elevation="2">
                                <v-row dense>
                                    <v-col cols="12" sm="6" md="3">
                                        <v-text-field
                                            v-model="multiSearch.nombre"
                                            label="Nombre"
                                            clearable
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6" md="3">
                                        <v-text-field
                                            v-model="multiSearch.email"
                                            label="Email"
                                            clearable
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6" md="3">
                                        <v-text-field
                                            v-model="multiSearch.telefono"
                                            label="Teléfono"
                                            clearable
                                        />
                                    </v-col>
                                </v-row>

                                <v-row class="mt-2" justify="end">
                                    <v-btn color="secondary" class="me-2" @click="limpiarFiltros">
                                        Limpiar
                                    </v-btn>
                                    <v-btn color="primary" @click="aplicarFiltros">
                                        Aplicar Filtros
                                    </v-btn>
                                </v-row>
                            </v-card>
                        </v-expand-transition>

                        
                        <v-toolbar  flat class="border-bottom">
                            <v-toolbar-title>Clientes</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary"  variant="flat" dark  v-bind="props" >Nuevo</v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="pa-4 pb-0">
                                        <span class="text-h5">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container class="px-0">
                                            <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.nombre"
                                                        label="Nombre"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.apellido"
                                                        label="Apellidos"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.email" label="Eamil"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.telefono"
                                                        label="Telefono"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" variant="flat" dark   @click="close">
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="success" variant="flat" dark   @click="save">
                                            Guardar
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                    <v-card-title class="text-h5 text-center py-6">¿Estás segura de que quieres eliminar este cliente?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" variant="flat" dark   @click="closeDelete">Cancelar</v-btn>
                                        <v-btn color="success" variant="flat" dark   @click="deleteItemConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actiones="{ item }">
                        <v-icon color="info" size="small" class="me-2" @click="editItem(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon color="error" size="small" @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        No hay clientes registrados.
                    </template>
                </v-data-table-server>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
  
  