<script setup>
import { ref } from 'vue';
import { useProductStore } from '@/stores/apps/product';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import LeftSide from '@/components/apps/ecommerce/addproduct/LeftSide.vue';
import RightSide from '@/components/apps/ecommerce/addproduct/RightSide.vue';

const productStore = useProductStore();
const page = ref({ title: 'Agregar Producto' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/'
    },
    {
        text: 'Agregar Producto',
        disabled: true,
        href: '#'
    }
]);

</script>
<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12" lg="9" md="8">
            <LeftSide/>
        </v-col>
        <v-col cols="12" lg="3" md="4">
            <RightSide/>
        </v-col>
    </v-row>
    <v-row class="mt-4">
        <v-col cols="12" class="text-right">
            <v-btn color="primary" flat @click="productStore.createProduct()" :disabled="!productStore.generalSaved || !productStore.advancedSaved">
                Crear Producto
            </v-btn>
        </v-col>
    </v-row>
</template>