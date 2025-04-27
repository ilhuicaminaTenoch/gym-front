<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import DatePicker from '@/components/forms/form-elements/datetime/DatePicker.vue';
const page = ref({ title: 'Promociones' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Promociones',
        disabled: true,
        href: '#'
    }
]);

const dialog = ref(false)
const dialogDelete = ref(false)
const headers = ref([
    {
        title: 'Descripcion',
        align: 'start',
        sortable: false,
        key: 'descripcion',
    },
    { title: 'Descuento', key: 'descuento' },
    { title: 'Plan', key: 'tipoPlan' },
    { title: 'Vigencia Inicio', key: 'startDate' },
    { title: 'Vigencia Fin', key: 'endDate' },
    { title: 'Actiones', key: 'actiones', sortable: false },
])
const desserts = ref([])
const editedIndex = ref(-1)
const editedItem = ref({
    descuento: '',
    tipoPlan: '',
    startDate: '',
    endDate: '',
})
const defaultItem = ref({
    descuento: '',
    tipoPlan: '',
    startDate: '',
    endDate: '',
})
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Nuevo Cliente' : 'Editar Cliente';
})
function initialize() {
    desserts.value = [
        {
            descripcion: 'Promoción especial verano',
            tipoPlan: 'SEMESTRAL',
            startDate: '2025-03-01',
            endDate: '2025-03-31',
            descuento: 15
        },
        {
            descripcion: 'Descuento de primavera',
            tipoPlan: 'ANUAL',
            startDate: '2025-04-01',
            endDate: '2025-04-30',
            descuento: 20
        },
        {
            descripcion: 'Oferta mes del cliente',
            tipoPlan: 'MENSUAL',
            startDate: '2025-05-01',
            endDate: '2025-05-31',
            descuento: 10
        },
        {
            descripcion: 'Paquete fidelidad anual',
            tipoPlan: 'ANUAL',
            startDate: '2025-06-01',
            endDate: '2025-06-30',
            descuento: 25
        },
        {
            descripcion: 'Reactivación de membresía',
            tipoPlan: 'MENSUAL',
            startDate: '2025-03-15',
            endDate: '2025-04-15',
            descuento: 12
        },
        {
            descripcion: 'Día del entrenador',
            tipoPlan: 'SEMESTRAL',
            startDate: '2025-07-01',
            endDate: '2025-07-15',
            descuento: 18
        },
        {
            descripcion: 'Mes de la salud',
            tipoPlan: 'ANUAL',
            startDate: '2025-08-01',
            endDate: '2025-08-31',
            descuento: 22
        },
        {
            descripcion: 'Promoción regreso a clases',
            tipoPlan: 'MENSUAL',
            startDate: '2025-09-01',
            endDate: '2025-09-30',
            descuento: 14
        },
        {
            descripcion: 'Black Friday Fit',
            tipoPlan: 'ANUAL',
            startDate: '2025-11-25',
            endDate: '2025-11-30',
            descuento: 30
        },
        {
            descripcion: 'Promoción navideña',
            tipoPlan: 'SEMESTRAL',
            startDate: '2025-12-01',
            endDate: '2025-12-31',
            descuento: 20
        },
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
                                                    <v-text-field v-model="editedItem.descripcion"
                                                        label="Descripcion"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.descuento"
                                                        label="Descuento"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.tipoPlan" label="Tipo de plan"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <DatePicker v-model="editedItem.startDate" label="Vigemcia inicio"/>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <DatePicker v-model="editedItem.endDate" label="Vigemcia fin"/>
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
  
  