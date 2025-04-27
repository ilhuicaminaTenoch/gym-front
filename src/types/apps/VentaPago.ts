export interface Product {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    codigoBarras?: string;
}

export interface CartItem extends Product {
    cantidad: number;
}

// Interface para solicitud de venta
/* export interface VentaRequest {
    items: CartItem[];
    subtotal: number;
    descuento: number;
    total: number;
    metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
    referenciaPago?: string;
} */

export interface POSState {
    products: Product[];
    carrito: CartItem[];
    subTotal: number;
    discount: number;
    total: number;
}

export interface VentaRequest {
    idCliente: number;
    idUsuario: number;
    idCaja: number;
    metodoPago: string;
    detalles: Detalle[];
    pago: {
        monto: number;
        metodoPago: string;
        numTransaccion?: string
        idPromocion?: number
    }
}

export interface Detalle {
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
}