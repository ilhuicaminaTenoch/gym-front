import { defineStore } from 'pinia';

import type { Products } from '@/types/apps/EcommerceType';

export interface ProductCreation {
    nombre: string;
    descripcion: string;
    precio: string;       // Se envía como string según el endpoint (ej. "100.82")
    stock: string;        // Se envía como string (ej. "54")
    codigoBarras: string;
    imagen?: string;      // URL o representación de la imagen
    sku: string;
    estatus: string;
};

export const useProductStore  = defineStore('product', {
    state: () => ({
        product: {
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            codigoBarras: '',
            imagen: '',
            sku: '',
            estatus: '',
        } as ProductCreation,
        generalSaved: false
    }),
    actions: {
        setGeneralData(data: Partial<ProductCreation>){
            this.product = { ...this.product, ...data };
            this.generalSaved = true;
        },
        updateRightSide(data: Partial<ProductCreation>) {
            this.product = { ...this.product, ...data };
        },
        resetProduct() {
            this.product = {
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                codigoBarras: '',
                imagen: '',
                sku: '',
                estatus: '',
            };
            this.generalSaved = false;
        }
    }
});