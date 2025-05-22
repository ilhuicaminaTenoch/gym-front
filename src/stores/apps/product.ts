import { defineStore } from 'pinia';
import type { Products } from '@/types/apps/EcommerceType'; // Assuming Products might be used elsewhere or for richer typing
import api from '@/utils/axios'; // Using the configured axios instance
import * as yup from 'yup';
import { useSnackbar } from '@/composables/useSnackbar';

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

// Define Yup schema outside the store actions for clarity and reusability if needed
const productSchema = yup.object().shape({
    nombre: yup.string().required('El nombre es requerido.').min(3, 'El nombre debe tener al menos 3 caracteres.').max(100, 'El nombre no debe exceder los 100 caracteres.'),
    descripcion: yup.string().optional(),
    // For precio and stock, the store holds them as strings.
    // The validation schema will transform them to numbers for validation
    // but the actual API payload will send them as strings.
    precio: yup.mixed() 
        .transform((value) => (value === '' || value === null || value === undefined) ? undefined : Number(value))
        .required('El precio es requerido.')
        .typeError('El precio debe ser un número válido.')
        .positive('El precio debe ser un número positivo.'),
    stock: yup.mixed()
        .transform((value) => (value === '' || value === null || value === undefined) ? undefined : Number(value))
        .required('El stock es requerido.')
        .typeError('El stock debe ser un número válido.')
        .integer('El stock debe ser un número entero.')
        .min(0, 'El stock no puede ser negativo.'),
    codigoBarras: yup.string().required('El código de barras es requerido.').min(8, 'El código de barras debe tener al menos 8 caracteres.').max(50, 'El código de barras no debe exceder los 50 caracteres.'),
    imagen: yup.string().optional().url('La imagen debe ser una URL válida.'),
    sku: yup.string().required('El SKU es requerido.').min(3, 'El SKU debe tener al menos 3 caracteres.').max(50, 'El SKU no debe exceder los 50 caracteres.').matches(/^[a-zA-Z0-9]+$/, 'El SKU debe ser alfanumérico sin espacios.'),
    estatus: yup.string().required('El estatus es requerido.'),
});

export const useProductStore  = defineStore('product', {
    state: () => ({
        product: {
            nombre: '',
            descripcion: '',
            precio: '', // Stored as string, validated as number, API expects string
            stock: '',  // Stored as string, validated as number, API expects string
            codigoBarras: '',
            imagen: '',
            sku: '',
            estatus: 'ACTIVO', // Default status
        } as ProductCreation,
        generalSaved: false // Example of another state property
    }),
    actions: {
        setGeneralData(data: Partial<ProductCreation>){
            this.product = { ...this.product, ...data };
            this.generalSaved = true;
        },
        updateRightSide(data: Partial<ProductCreation>) { // Potentially useful for partial updates
            this.product = { ...this.product, ...data };
        },
        setProductField(field: keyof ProductCreation, value: any) {
            // Type assertion needed because ProductCreation fields are strings, 
            // but components might pass numbers for precio/stock before they are stringified for API
            // or before store stringifies them if it were to do so.
            // For this setup, components should ensure they pass string if that's what store holds.
            // Or, this action can handle conversion if needed.
            (this.product as any)[field] = value;
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
                estatus: 'ACTIVO',
            };
            this.generalSaved = false;
        },

        async submitProduct(): Promise<boolean> {
            const { showSuccess, showError } = useSnackbar();

            // The `this.product` state already holds precio and stock as strings,
            // which is what the API expects for the payload.
            // The yup schema's .transform() handles converting these to numbers for validation logic only.
            try {
                await productSchema.validate(this.product, { abortEarly: false });
            } catch (validationError: any) {
                const errorMessages = validationError.inner?.map((err: any) => `${err.path}: ${err.message}`).join('; ') || "Por favor, corrige los errores en el formulario.";
                showError(`Errores de validación: ${errorMessages}`);
                return false;
            }

            // Prepare payload for API.
            // Since this.product already stores precio and stock as strings, direct use is fine.
            const payload: ProductCreation = {
                ...this.product,
                // Ensure descripcion and imagen are handled if API expects absence vs empty string
                descripcion: this.product.descripcion || '', 
                imagen: this.product.imagen || undefined, // Send undefined if image string is empty and API prefers that
            };

            try {
                const response = await api.post('/api/products', payload);
                if (response.status === 201) {
                    showSuccess('Producto creado exitosamente.');
                    this.resetProduct();
                    return true;
                } else {
                    showError(`Respuesta inesperada del servidor: ${response.status}`);
                    return false;
                }
            } catch (apiError: any) {
                if (apiError.response && apiError.response.data && apiError.response.data.message) {
                    showError(apiError.response.data.message);
                } else if (apiError.message) {
                    showError(`Error al crear el producto: ${apiError.message}`);
                } else {
                    showError('Error desconocido al crear el producto. Inténtalo de nuevo.');
                }
                return false;
            }
        }
    }
});