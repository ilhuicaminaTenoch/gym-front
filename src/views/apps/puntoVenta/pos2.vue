<template>
    <v-container fluid>
        <v-row>
            <!-- Sección de productos -->
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

            <!-- Sección de orden y detalles de carrito -->
            <v-col cols="12" md="5">
                <v-card class="pa-4">
                    <div class="d-flex justify-space-between align-center mb-4">
                        <h3 class="text-h6 mb-0">Orden Actual</h3>
                        <v-btn icon @click="vaciarCarrito" :disabled="posStore.carrito.length === 0">
                            <v-tooltip activator="parent" location="top">
                                <template #activator="{ on, attrs }">
                                    <v-icon v-bind="attrs" v-on="on">mdi-trash-can</v-icon>
                                </template>
                                Borrar carrito
                            </v-tooltip>
                        </v-btn>
                    </div>

                    <!-- Tabla de productos en el carrito -->
                    <v-table>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                        </tr>
                        </thead>
                        <tbody>
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
                        </tr>
                        </tbody>
                    </v-table>

                    <v-divider class="my-2" />

                    <!-- Totales -->
                    <div class="d-flex justify-space-between align-center">
                        <span class="text-subtitle-1">Sub Total:</span>
                        <span class="text-subtitle-1">$ {{ subTotal.toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-space-between align-center">
                        <span class="text-subtitle-1">Descuento:</span>
                        <span class="text-subtitle-1">$ {{ descuento.toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-space-between align-center mb-4">
                        <span class="text-h6 font-weight-bold">Total:</span>
                        <span class="text-h6 font-weight-bold">$ {{ total.toFixed(2) }}</span>
                    </div>

                    <!-- Selector de método de pago con v-btn-toggle -->
                    <v-btn-toggle
                        v-model="metodoPago"
                        mandatory
                        tile
                        class="d-flex flex-row flex-wrap gap-2 mt-2"
                    >
                        <v-btn value="EFECTIVO" class="payment-btn d-flex flex-column align-center pa-3">
                            <v-icon size="28">mdi-cash</v-icon>
                            <span class="text-caption mt-1">Efectivo</span>
                        </v-btn>
                        <v-btn value="TARJETA" class="payment-btn d-flex flex-column align-center pa-3">
                            <v-icon size="28">mdi-credit-card</v-icon>
                            <span class="text-caption mt-1">Tarjeta</span>
                        </v-btn>
                        <v-btn value="TRANSFERENCIA" class="payment-btn d-flex flex-column align-center pa-3">
                            <v-icon size="28">mdi-bank-transfer</v-icon>
                            <span class="text-caption mt-1">Transf.</span>
                        </v-btn>
                    </v-btn-toggle>

                    <!-- Botones de acción -->
                    <v-btn
                        block
                        color="success"
                        class="mb-2 mt-4"
                        :disabled="posStore.carrito.length === 0"
                        @click="pagar"
                    >
                        Pagar
                    </v-btn>
                    <v-btn
                        block
                        color="primary"
                        :disabled="posStore.carrito.length === 0"
                        @click="guardarOrden"
                    >
                        Guardar Orden
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import { useSnackbar } from '@/composables/useSnackbar';
import api from '@/utils/axios';
import StepFirst from '@/components/apps/ecommerce/cart/steps/StepFirst.vue';
import { usePOSStore } from '@/stores/apps/POS';
import { useAuthStore } from '@/stores/auth';
import type { VentaRequest, Detalle, CartItem, Product } from '@/types/apps/VentaPago';

const productos = ref<any[]>([]);
const procesandoPago = ref(false);

const search = ref('');
const searchInputRef = ref();
const searchType = ref<'codigoBarras' | 'nombre'>('codigoBarras');
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const { showSuccess, showError } = useSnackbar();
const loading = ref(false);

const lastInputTime = ref(0);
const isScannerInput = ref(false);

const posStore = usePOSStore();
const authStore = useAuthStore();

const subTotal = computed(() => posStore.subTotal);
const descuento = computed(() => posStore.discount);
const total = computed(() => posStore.total);

// Variable para el método de pago
const metodoPago = ref<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'>('EFECTIVO');

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

function actualizarCantidad(item: CartItem) {
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

function vaciarCarrito() {
    posStore.resetCart();
}

async function pagar() {
    try {
        if (posStore.carrito.length === 0) {
            showError('El carrito está vacío');
            return;
        }
        // Verificar stock disponible
        const sinStock = await posStore.verificarStockDisponible();
        if (sinStock.length > 0) {
            showError('Algunos productos no tienen stock disponible');
            return;
        }
        // Actualizar stock en backend en lote
        await posStore.actualizarStockBackend();
        // Crear payload de venta
        const payload: VentaRequest = {
            idCliente: null,
            idUsuario: authStore.user.userId,
            idCaja: 1,
            metodoPago: metodoPago.value,
            detalles: transformarProductos(posStore.carrito),
            pago: {
                monto: posStore.total,
                metodoPago: metodoPago.value,
            }
        };
        const resultado = await posStore.procesarVenta(payload);
        showSuccess(`Venta registrada`);
        posStore.resetCart();
    } catch (error: any) {
        showError(error.message || 'Error procesando pago');
    } finally {
        procesandoPago.value = false;
    }
}

function guardarOrden() {
    alert('Orden guardada');
}

function verOrdenes() {
    alert('Mostrar órdenes anteriores...');
}

function transformarProductos(productos: CartItem[]): Detalle[] {
    return productos.map(prod => ({
        idProducto: prod.id,
        cantidad: prod.cantidad,
        precioUnitario: prod.precio
    }));
}

onMounted(() => {
    // Cargar productos o inicializar la vista si es necesario
});
</script>

<style scoped>
.payment-btn {
    border: 1px solid var(--v-theme-on-background, #ccc);
    min-width: 80px;
    transition: background-color 0.3s;
}
.payment-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>
