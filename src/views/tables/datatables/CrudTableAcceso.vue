<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import DatePicker from '@/components/forms/form-elements/datetime/DatePicker.vue';
const page = ref({ title: 'Accesos' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Accesos',
        disabled: true,
        href: '#'
    }
]);

const dialog = ref(false)
const dialogDelete = ref(false)
const headers = ref([
    {
        title: 'Cliente',
        align: 'start',
        sortable: false,
        key: 'cliente',
    },
    { title: 'Tipo de acceso', key: 'tipoAcceso' },
    { title: 'Metodo de acceso', key: 'metodoAcceso' },
    { title: 'Fecha de acceso', key: 'fechaAcceso' },
    { title: 'Actiones', key: 'actiones', sortable: false },
])
const desserts = ref([])
const editedIndex = ref(-1)
const editedItem = ref({
    cliente: '',
    tipoAcceso: '',
    metodoAcceso: '',
    fechaAcceso: '',
})
const defaultItem = ref({
    cliente: '',
    tipoAcceso: '',
    metodoAcceso: '',
    fechaAcceso: '',
})
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Nuevo Acceso' : 'Editar Acceso';
})
function initialize() {
    desserts.value = [
        {
            cliente: 'Manuel Moreno',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-31 07:45:12',
        },
        {
            cliente: 'Manuel Moreno',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-31 09:58:33',
        },
        {
            cliente: 'Laura Sánchez',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-30 17:05:22',
        },
        {
            cliente: 'Laura Sánchez',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-30 19:10:45',
        },
        {
            cliente: 'Carlos Pérez',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-29 06:30:21',
        },
        {
            cliente: 'Carlos Pérez',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-29 08:55:03',
        },
        {
            cliente: 'Andrea Romero',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-28 08:12:34',
        },
        {
            cliente: 'Andrea Romero',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-28 10:18:47',
        },
        {
            cliente: 'Luis Martínez',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-27 19:45:11',
        },
        {
            cliente: 'Luis Martínez',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-27 21:05:50',
        },
        {
            cliente: 'Paola Gómez',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-26 09:20:15',
        },
        {
            cliente: 'Paola Gómez',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-26 11:10:40',
        },
        {
            cliente: 'Fernando Ruiz',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-25 18:25:00',
        },
        {
            cliente: 'Fernando Ruiz',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-25 20:35:48',
        },
        {
            cliente: 'Mariana Díaz',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-24 20:15:11',
        },
        {
            cliente: 'Mariana Díaz',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-24 22:10:30',
        },
        {
            cliente: 'José Hernández',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-23 05:55:05',
        },
        {
            cliente: 'José Hernández',
            tipoAcceso: 'BIOMETRIA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-23 07:44:42',
        },
        {
            cliente: 'Valeria Cruz',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'ENTRADA',
            fechaAcceso: '2025-03-22 08:00:00',
        },
        {
            cliente: 'Valeria Cruz',
            tipoAcceso: 'TARJETA',
            metodoAcceso: 'SALIDA',
            fechaAcceso: '2025-03-22 09:55:35',
        }
    ]
}
function editItem(item) {
    editedIndex.value = desserts.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialog.value = true
}
function deleteItem(item) {
    editedIndex.value = desserts.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
}
function deleteItemConfirm() {
    desserts.value.splice(editedIndex.value, 1)
    closeDelete()
}
function close() {
    dialog.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
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
function save() {
    if (editedIndex.value > -1) {
        Object.assign(desserts.value[editedIndex.value], editedItem.value)
    } else {
        desserts.value.push(editedItem.value)
    }
    close()
}
watch(dialog, val => {
    val || close()
})
watch(dialogDelete, val => {
    val || closeDelete()
})
initialize()
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Crud Table">
                <v-data-table class="border rounded-md crud-tbl" :headers="headers" :items="desserts" :sort-by="[{ key: 'descuento', order: 'asc' }]">
                    <template v-slot:top>
                        <v-toolbar  flat class="border-bottom">
                            <v-toolbar-title>Promociones</v-toolbar-title>
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
                                                    <v-text-field v-model="editedItem.cliente"
                                                        label="Cliente"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.tipoAcceso"
                                                        label="Tipo de acceso"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.fechaAcceso" label="Fecha de acceso"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.metodoAcceso"
                                                                  label="Metodo de acceso"></v-text-field>
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
                        <v-btn color="primary" @click="initialize">
                            Reset
                        </v-btn>
                    </template>
                </v-data-table>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
  
  