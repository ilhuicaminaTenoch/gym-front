// /stores/apps/eCommere.ts (ajustado para punto de venta)
import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import { filter, find, sum } from 'lodash';
import type {
    VentaRequest,
    POSState,
    CartItem,
    Product
} from '@/types/apps/VentaPago'

export const usePOSStore = defineStore({
    id: 'pos',
    state: (): POSState => ({
        products: [],
        carrito: [],
        subTotal: 0,
        discount: 0,
        total: 0,
    }),
    actions: {
        async verificarStockDisponible() {
            const productosSinStock: CartItem[] = [];

            for (const item of this.carrito) {
                const productoOriginal = this.products.find(p => p.id === item.id);

                if (!productoOriginal || productoOriginal.stock < item.cantidad) {
                    productosSinStock.push(item);
                }
            }

            return productosSinStock;
        },

        async actualizarStockBackend() {
            try {
                const payload = {
                    items: this.carrito.map(item => ({
                        idProducto: item.id,
                        ajuste: -item.cantidad
                    }))
                };

                await axios.put('/productos/ajustar', payload);
            } catch (error) {
                console.error('Error actualizando stock:', error);
                throw error;
            }
        },

        async procesarVenta(payload: VentaRequest) {
            try {
                const response = await axios.post('/ventas', payload);
                if (response.data) {
                    this.resetCart();
                    return response.data;
                }
                throw new Error('Error en el servidor');

            } catch (error) {
                console.error('Error al procesar venta:', error);
                throw error;
            }
        },

        async fetchProducts() {
            try {
                const { data } = await axios.get('/productos');
                // Se espera que la respuesta tenga la propiedad "content" con la lista de productos
                this.products = data.content || [];
            } catch (error) {
                console.error("Error al obtener productos", error);
            }
        },

        agregarProducto(producto: Product) {
            const item = this.carrito.find((p) => p.id === producto.id);
            if (item) {
                item.cantidad++;
            } else {
                this.carrito.push({ ...producto, cantidad: 1 });
                this.products.push(producto);
            }
            this.calcularTotales();
        },

        eliminarProducto(id: number) {
            this.carrito = this.carrito.filter((item) => item.id !== id);
            this.products = this.products.filter((item) => item.id !== id);
            this.calcularTotales();
        },

        incrementarCantidad(id: number) {
            const item = this.carrito.find((p) => p.id === id);
            if (item) {
                item.cantidad++;
            }
            this.calcularTotales();
        },

        decrementarCantidad(id: number) {
            const item = this.carrito.find((p) => p.id === id);
            if (item && item.cantidad > 1) {
                item.cantidad--;
            }
            this.calcularTotales();
        },

        calcularTotales() {
            this.subTotal = sum(this.carrito.map((item) => item.precio * item.cantidad));
            /* Descuento del 5%
            this.discount = Math.round(this.subTotal * 0.05);
            this.total = this.subTotal - this.discount; */
            this.total = this.subTotal;
        },

        resetCart() {
            this.carrito = [];
            this.products = [];
            this.calcularTotales();
        },
    },
});
