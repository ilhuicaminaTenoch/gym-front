import { defineStore } from 'pinia';

import type { Products } from '@/types/apps/EcommerceType';

export interface ProductVariationItem {
    type: string;
    value: string;
}

export interface ProductCreation {
    nombre: string;
    descripcion: string;
    precio: string;       // Se envía como string según el endpoint (ej. "100.82")
    stock: string;        // Se envía como string (ej. "54")
    codigoBarras: string;
    imagen?: string;      // URL o representación de la imagen
    sku: string;
    estatus: string;
    cantidad?: number;
    variations?: ProductVariationItem[];
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
            cantidad: 0,
            variations: []
        } as ProductCreation,
        generalSaved: false,
        advancedSaved: false
    }),
    actions: {
        setGeneralData(data: Partial<ProductCreation>){
            this.product = { ...this.product, ...data };
            this.generalSaved = true;
        },
        setAdvancedData(data: Partial<ProductCreation>){
            this.product = { ...this.product, ...data };
            this.advancedSaved = true;
        },
        updateRightSide(data: Partial<ProductCreation>) {
            this.product = { ...this.product, ...data };
        },
        createProduct() {
            console.log('Creating product:', this.product);
            this.resetProduct();
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
                cantidad: 0,
                variations: []
            };
            this.generalSaved = false;
            this.advancedSaved = false;
        }
    }
});