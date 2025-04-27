<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useSnackbar } from '@/composables/useSnackbar';
import api from '@/utils/axios';
import StepFirst from '@/components/apps/ecommerce/cart/steps/StepFirst.vue';
import { usePOSStore } from '@/stores/apps/POS';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import type { VentaRequest, Detalle, CartItem } from '@/types/apps/VentaPago';


const productos = ref<any[]>([]);
const procesandoPago = ref(false);


const dialogPago = ref(false);
const metodoPago = ref<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'>('EFECTIVO');
const referenciaPago = ref('');

const search = ref('');
const searchInputRef = ref();
const searchType = ref<'codigoBarras' | 'nombre'>('codigoBarras');
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const { showSuccess, showError } = useSnackbar();
const loading = ref(false);


const posStore = usePOSStore();
const authStore = useAuthStore();

const total = computed(() => posStore.total.toFixed(2));

function focusSearchInput() {
    nextTick(() => searchInputRef.value?.focus());
}

function agregarProducto(producto: any) {
    posStore.agregarProducto(producto);
    showSuccess(`Agregado: ${producto.nombre}`);
    search.value = '';
    productos.value = [];
    focusSearchInput();
}

function eliminarProducto(id: number) {
    posStore.eliminarProducto(id);
}

function actualizarCantidad(item: any) {
    item.cantidad = Math.max(1, item.cantidad);
    posStore.calcularTotales();
}

async function buscarProductoYAgregar() {
    if (!search.value) return;
    loading.value = true;
    try {
        const { data } = await api.get('/productos', {
            params:
                searchType.value === 'codigoBarras'
                    ? { codigoBarras: search.value }
                    : { nombre: search.value }
        });

        const resultados = data.content || [];

        if (resultados.length === 1) {
            agregarProducto(resultados[0]);
        } else {
            showError('Producto no encontrado');
        }
    } catch (error) {
        showError('Error al buscar producto');
    } finally {
        loading.value = false;
    }
}

async function onEnterBuscar() {
    await buscarProductoYAgregar();
}

watch(search, (val) => {
    if (!val) return;

    const esCodigo = searchType.value === 'codigoBarras';
    const minLength = esCodigo ? 12 : 3;

    if (val.length < minLength) return;

    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
        buscarProductoYAgregar();
    }, 300);
});



async function pagar() {
    try {

        if (posStore.carrito.length === 0) {
            showError('El carrito está vacío');
            return;
        }

        const sinStock = await posStore.verificarStockDisponible();
        if (sinStock.length > 0) {
            showError('Algunos productos no tienen stock disponible');
            return;
        }

        await posStore.actualizarStockBackend();

        // Crear payload con tipo VentaRequest
        const payload: VentaRequest = {
            idUsuario: authStore.user.userId,
            idCaja: 1,
            metodoPago: "EFECTIVO",
            detalles: transformarProductos(posStore.carrito),
            pago: {
                monto:posStore.total,
                metodoPago: "EFECTIVO",
            }
        };

        // Procesar venta
        const resultado = await posStore.procesarVenta(payload);

        showSuccess(`Venta #${resultado.pago.numTransaccion} registrada`);
        posStore.resetCart();

    } catch (error: any) {
        showError(error.message || 'Error procesando pago');
    } finally {
        procesandoPago.value = false;
    }
}

function transformarProductos(productos: CartItem[]): Detalle[] {
    return productos.map(prod => ({
        idProducto: prod.id, // se asigna el valor de "id" al campo "idProducto"
        cantidad: prod.cantidad,
        precioUnitario: prod.precio
    }));
}

</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="7">
                <v-card class="pa-4 mb-4">
                    <v-radio-group v-model="searchType" row>
                        <v-radio label="Código de barras" value="codigoBarras" />
                        <v-radio label="Nombre" value="nombre" />
                    </v-radio-group>

                    <v-text-field
                        ref="searchInputRef"
                        v-model="search"
                        :label="searchType === 'codigoBarras' ? 'Buscar por código de barras' : 'Buscar por nombre'"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        :loading="loading"
                        @keyup.enter="onEnterBuscar"
                        @click:clear="() => { search = ''; productos = []; focusSearchInput(); }"
                    />
                    <StepFirst />
                </v-card>
            </v-col>
            <v-col cols="12" md="5">
                <v-card class="pa-4">
                    <h3 class="text-h6 mb-4">Carrito</h3>
                    <v-table>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <!-- Se recorre el carrito desde el store -->
                        <tr v-for="item in posStore.carrito" :key="item.id">
                            <td>{{ item.nombre }}</td>
                            <td>
                                <template v-if="item.cantidad < 3">
                                    {{ item.cantidad }}
                                </template>
                                <template v-else>
                                    <v-text-field
                                        v-model.number="item.cantidad"
                                        type="number"
                                        min="1"
                                        max="999"
                                        hide-details
                                        density="compact"
                                        style="max-width: 60px"
                                        @change="actualizarCantidad(item)"
                                    />
                                </template>
                            </td>
                            <td>$ {{ (item.precio * item.cantidad).toFixed(2) }}</td>
                            <td>
                                <v-btn
                                    icon
                                    color="lighterror"
                                    class="mx-auto"
                                    size="x-small"
                                    @click="eliminarProducto(item.id)"
                                >
                                    <v-tooltip activator="parent" location="top"
                                    >Borrar producto</v-tooltip
                                    >
                                    <Icon
                                        icon="solar:trash-bin-minimalistic-linear" class="text-error"
                                        height="18"
                                    />
                                </v-btn>
                            </td>
                        </tr>
                        </tbody>
                    </v-table>
                    <v-divider class="my-4" />
                    <div class="d-flex justify-space-between align-center">
                        <span class="text-subtitle-1 font-weight-bold">Total:</span>
                        <span class="text-h6">$ {{ total }}</span>
                    </div>
                    <v-btn block color="success" class="mt-4" @click="pagar">Pagar</v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
