<script setup lang="ts">
import { computed } from 'vue';
import { usePOSStore } from '@/stores/apps/POS';
import CartEmpty from '../CartEmpty.vue';
// import OrderSummaryVue from './OrderSummary.vue';

const store = usePOSStore();
const getCart = computed(() => {
    return store.products;
});
</script>
<template>
    <div v-if="getCart.length > 0">
        <v-divider />
        <v-table>
            <thead>
                <tr>
                    <th class="text-left text-subtitle-1 font-weight-semibold">Producto</th>
                    <th class="text-left text-subtitle-1 font-weight-semibold">Precio</th>
                    <th class="text-left text-subtitle-1 font-weight-semibold">Stock Disponible</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in getCart" :key="item.nombre">
                    <td>
                        <div class="d-flex align-center my-3 gap-2">
                            <div class="ma-2">
                                <h6 class="text-left text-subtitle-1">{{ item.nombre }}</h6>
                            </div>
                        </div>
                    </td>
                    <td>
                        <h4 class="text-left text-subtitle-1">${{ item.precio }}</h4>
                    </td>
                    <td>
                        <v-chip
                            :color="item.stock <= item.stockMinimo ? 'warning' : 'success'"
                            variant="outlined"
                        >
                            {{ item.stock }}
                        </v-chip>
                    </td>
                </tr>
            </tbody>
        </v-table>
<!--        <OrderSummaryVue />-->
    </div>
    <div v-else class="d-flex justify-center">
        <CartEmpty />
    </div>
</template>
<style>
.custom-img-box {
    width: 60px;
    height: 60px;
}
</style>
