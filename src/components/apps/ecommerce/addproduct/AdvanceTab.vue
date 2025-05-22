<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
// import { useEditor, EditorContent } from '@tiptap/vue-3'; // Not used in this tab's relevant fields
// import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue'; // Not used
// import StarterKit from '@tiptap/starter-kit'; // Not used
import { XIcon } from 'vue-tabler-icons';
import { useProductStore } from '@/stores/apps/product';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const productStore = useProductStore();

// Custom Yup messages for SKU to achieve the specific combined message
// These will be combined by Yup for the final error message if multiple rules fail.
yup.setLocale({
  string: {
    min: ({ label, min }) => `${label || 'Este campo'} debe tener al menos ${min} caracteres.`,
    max: ({ label, max }) => `${label || 'Este campo'} no debe exceder los ${max} caracteres.`,
    required: ({ label }) => `${label || 'Este campo'} es requerido.`, // More generic required message
  },
  mixed: {
    required: ({ path }) => `${path.charAt(0).toUpperCase() + path.slice(1)} es requerido.`
  }
});


// Yup Validation Schema
const advanceSchema = yup.object({
    sku: yup.string()
        .required()
        .min(3)
        .max(50)
        .matches(/^[a-zA-Z0-9]+$/, 'El SKU debe ser alfanumérico sin espacios.')
        .label('SKU'),
    codigoBarras: yup.string()
        .required('El código de barras es requerido.')
        .min(8, 'El código de barras debe tener al menos 8 caracteres.')
        .max(50, 'El código de barras no debe exceder los 50 caracteres.')
        .label('Código de Barras'),
    stock: yup.number()
        .transform(value => (isNaN(value) || value === null || value === undefined || value === '') ? undefined : value) // Handle empty input for number
        .required('La cantidad de stock es requerida.')
        .integer('La cantidad de stock debe ser un número entero.')
        .min(0, 'La cantidad de stock debe ser un número entero no negativo.')
        .label('Cantidad de stock'),
});

// VeeValidate Form Setup
const { handleSubmit, setFieldValue, values, errors } = useForm({
    validationSchema: advanceSchema,
    initialValues: {
        sku: productStore.product.sku,
        codigoBarras: productStore.product.codigoBarras,
        stock: productStore.product.stock === null || productStore.product.stock === undefined || productStore.product.stock === '' ? undefined : Number(productStore.product.stock),
    }
});

// VeeValidate Fields
const { value: skuModel, errorMessage: skuError } = useField<string>('sku');
const { value: codigoBarrasModel, errorMessage: codigoBarrasError } = useField<string>('codigoBarras');
const { value: stockModel, errorMessage: stockError } = useField<number | undefined>('stock');


// Sync form fields with store reactively (Form -> Store)
watch(skuModel, (newVal) => {
    productStore.setProductField('sku', newVal || ''); // Ensure empty string if null/undefined
});
watch(codigoBarrasModel, (newVal) => {
    productStore.setProductField('codigoBarras', newVal || ''); // Ensure empty string
});
watch(stockModel, (newVal) => {
    // Store stock as number or null (if it's allowed by backend, otherwise handle as 0)
    productStore.setProductField('stock', newVal === undefined || newVal === null ? null : Number(newVal));
});

// Sync store changes to form fields (Store -> Form)
onMounted(() => {
    setFieldValue('sku', productStore.product.sku);
    setFieldValue('codigoBarras', productStore.product.codigoBarras);
    const storeStock = productStore.product.stock;
    setFieldValue('stock', storeStock === null || storeStock === undefined || storeStock === '' ? undefined : Number(storeStock));
});

watch(() => productStore.product.sku, (newVal) => {
    if (newVal !== skuModel.value) setFieldValue('sku', newVal);
});
watch(() => productStore.product.codigoBarras, (newVal) => {
    if (newVal !== codigoBarrasModel.value) setFieldValue('codigoBarras', newVal);
});
watch(() => productStore.product.stock, (newVal) => {
    const formStock = newVal === null || newVal === undefined || newVal === '' ? undefined : Number(newVal);
    if (formStock !== stockModel.value) setFieldValue('stock', formStock);
});


// Save Changes Handler
const handleSaveChanges = handleSubmit(async (formValues) => {
    // Step Preliminar: Ensure store is updated with validated values
    // This is largely handled by reactive watchers, but explicitly setting here ensures final validated values are in store.
    productStore.setProductField('sku', formValues.sku || '');
    productStore.setProductField('codigoBarras', formValues.codigoBarras || '');
    productStore.setProductField('stock', formValues.stock === undefined || formValues.stock === null ? null : Number(formValues.stock));

    console.log('AdvanceTab fields validated. Current store state:', JSON.parse(JSON.stringify(productStore.product)));
    // TODO: Aquí se llamará a la validación global y a la función de envío a la API
    alert('Cambios de AdvanceTab validados y guardados en el store (simulado). Ver consola.');
}, (context) => {
    console.error('Validation failed for AdvanceTab:', context.errors);
    alert('Validación fallida en AdvanceTab. Por favor revise los errores.');
});


// Unused refs from original template, kept for now if other parts of template use them
// const editor = useEditor({ extensions: [StarterKit] }); // Not used for SKU, CodigoBarras, Stock
const checkbox = ref(false);
const shipping = ref(false);
const ship = ref(null);
const select = ref('Size'); // For variations part of template
const items = ref(['Color', 'Size', 'Material', 'Style']); // For variations part of template

</script>
<template>
    <v-form @submit.prevent="handleSaveChanges">
        <div class="pa-1 pt-0">
            <!-- Inventory -->
            <v-card elevation="10" class="mb-6">
                <v-card-text>
                    <h5 class="text-h5 mb-8">Inventario</h5>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">SKU <span class="text-error ms-1">*</span></v-label>
                            <VTextField 
                                type="text" 
                                placeholder="SKU" 
                                variant="outlined" 
                                v-model="skuModel"
                                :error-messages="skuError" 
                            />
                            <!-- Combined message requirement is tricky with yup's default message generation. -->
                            <!-- The custom yup.setLocale helps. The error message from yup will be a concatenation if multiple rules fail. -->
                            <!-- The text below serves as a static guide. -->
                            <p class="textSecondary text-12 mt-1">El SKU es requerido, debe tener 3-50 caracteres alfanuméricos sin espacios.</p>
                        </v-col>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Codigo de Barras <span class="text-error ms-1">*</span></v-label>
                            <VTextField 
                                type="text" 
                                placeholder="Número de código de barras" 
                                variant="outlined" 
                                v-model="codigoBarrasModel"
                                :error-messages="codigoBarrasError"
                            />
                             <p class="textSecondary text-12 mt-1">El código de barras es requerido y debe tener 8-50 caracteres.</p>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-label class="font-weight-medium mb-2">Cantidad <span class="text-error ms-1">*</span></v-label>
                            <VTextField 
                                type="number" 
                                placeholder="Cantidad en stock"
                                variant="outlined" 
                                v-model.number="stockModel"
                                :error-messages="stockError"
                            />
                            <p class="textSecondary text-12 mt-1">La cantidad de stock es requerida y debe ser un número entero no negativo.</p>
                        </v-col>
                        <v-col cols="12" md="6">
                             <!-- This field appears to be decorative or for display only based on original template -->
                            <v-label class="font-weight-medium mb-3 invisible">Placeholder Label for Alignment</v-label> 
                            <VTextField type="number" placeholder="En almacén" variant="outlined" hide-details disabled />
                        </v-col>
                        <!-- <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Allow Backorders</v-label>
                            <div class="d-flex flex-wrap align-center ml-n2">
                                <v-checkbox class="pe-2" v-model="checkbox" required hide-details color="primary">
                                    <template v-slot:label class="font-weight-medium">Yes</template>
                                </v-checkbox>
                            </div>
                            <p class="textSecondary text-12 mt-n2">Allow customers to purchase products that are out of stock.</p>
                        </v-col> -->
                    </v-row>
                </v-card-text>
            </v-card>

            <!-- Variations (Existing template structure - not part of this task's validation) -->
            <v-card elevation="10" class="mb-6">
                <v-card-text>
                    <h5 class="text-h5 mb-8">Variaciones</h5>
                    <v-row>
                        <v-col cols="12" md="10">
                            <v-label class="font-weight-medium mb-2">Agregar variaciones de producto</v-label>
                            <v-row>
                                <v-col cols="4" class="pb-0">
                                    <v-select v-model="select" :items="items" variant="outlined" class="text-body-1" hide-details></v-select>
                                </v-col>
                                <v-col cols="4" class="pb-0">
                                    <VTextField type="text" placeholder="Variation" variant="outlined" hide-details></VTextField>
                                </v-col>
                                <v-col cols="2" class="pb-0">
                                    <v-btn variant="tonal" flat size="large" class="px-0 py-0" color="error" min-width="50"
                                        ><XIcon height="25" />
                                    </v-btn>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn variant="tonal" color="primary"><span class="text-20 me-1">+</span> Add another variation</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

        </div>
        <div class="d-flex mb-md-0 mb-3 gap-3 pa-1 pt-0">
            <v-btn flat color="primary" type="submit"> save changes </v-btn>
            <v-btn variant="tonal" color="error"> cancel </v-btn>
        </div>
    </v-form>
</template>
