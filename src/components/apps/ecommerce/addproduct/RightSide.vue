<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import preview from '@/assets/images/backgrounds/preview-img.png'; // Default preview
import { useSnackbar } from '@/composables/useSnackbar';
import { useProductStore } from '@/stores/apps/product';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const { showSuccess, showError } = useSnackbar();
const productStore = useProductStore();

// --- Image Handling ---
const fileInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string>(productStore.product.imagen || preview); // Use default preview if no image
const selectedFile = ref<File | null>(null);

watch(() => productStore.product.imagen, (newVal) => {
    imageUrl.value = newVal || preview;
});

watch(imageUrl, (newUrl) => {
    if (newUrl !== productStore.product.imagen) {
        productStore.setProductField('imagen', newUrl);
        // showSuccess('Imagen actualizada en el store'); // Optional: notify on reactive update
    }
});

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        imageUrl.value = productStore.product.imagen || preview; // Reset to store image or preview if no file selected
        selectedFile.value = null;
        return;
    }

    if (file.size > 1024 * 1024 * 5) { // 5MB limit
        showError('¡El tamaño del archivo es demasiado grande! Se permiten 5 MB como máximo.');
        if (fileInput.value) fileInput.value.value = ''; // Clear the file input
        return;
    }

    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imageUrl.value = e.target?.result as string; // This will trigger the watcher to update the store
    };
    reader.readAsDataURL(file);
};

// --- VeeValidate and Yup Setup for Estatus ---
const estatusValidationSchema = yup.object({
    estatus: yup.string().required('El estatus del producto es requerido.'),
});

const { handleSubmit: validateEstatus, errors: formErrors } = useForm({
    validationSchema: estatusValidationSchema,
    initialValues: {
        estatus: productStore.product.estatus || 'ACTIVO',
    }
});

const { value: estatusModel, errorMessage: estatusError, handleChange: handleEstatusChange } = useField<string>('estatus');

// --- Computed properties for store synchronization ---
// SKU, CodigoBarras, Stock are not editable in this component's template.
// If they were, computed properties would look like this:
/*
const sku = computed({
    get: () => productStore.product.sku,
    set: (val) => productStore.setProductField('sku', val)
});
const codigoBarras = computed({
    get: () => productStore.product.codigoBarras,
    set: (val) => productStore.setProductField('codigoBarras', val)
});
const stock = computed({
    get: () => productStore.product.stock,
    set: (val) => productStore.setProductField('stock', Number(val)) // Assuming stock is number
});
*/

// Synchronization for estatus (using watch, as useField handles the local model)
watch(estatusModel, (newVal) => {
    if (newVal !== productStore.product.estatus) {
        productStore.setProductField('estatus', newVal);
    }
});

// Ensure estatusModel is updated if store changes externally
watch(() => productStore.product.estatus, (newVal) => {
    if (newVal !== estatusModel.value) {
        estatusModel.value = newVal || 'ACTIVO';
    }
});


// The saveRightSide function is no longer strictly necessary for these fields due to reactive updates.
// It could be repurposed if there was a specific "Save" button for this section,
// or for operations like actual file upload to a server.
// For now, direct store updates via computed props/watchers are preferred.
/*
function saveRightSide() {
    // Validate estatus before any explicit save action, if needed
    validateEstatus().then(result => {
        if (result.valid) {
            // This part is now largely handled by reactive updates.
            // Only specific actions like actual file upload might go here.
            productStore.updateRightSide({ // This store action might need adjustment
                imagen: imageUrl.value,
                // sku, codigoBarras, stock would be directly from store or their computed wrappers
                estatus: estatusModel.value,
            });
            showSuccess('Datos secundarios actualizados');
        } else {
            showError('Por favor, corrija los errores de validación.');
        }
    });
}
*/
const estatusItems = ['ACTIVO', 'INACTIVO'];

</script>
<template>
    <div class="mt-md-16 mt-5">
        <div class="pt-md-7">
            <!-- Thumbnail -->
            <v-card elevation="10" class="mb-6">
                <v-card-item>
                    <h5 class="text-h5 mb-8">Imagen</h5>
                    <div class="upload-btn-wrapper position-relative overflow-hidden d-flex align-center" elevation="10">
                        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" />
                        <img :src="imageUrl" alt="Image Preview" class="w-100" />
                    </div>
                    <p class="text-12 textSecondary text-center mt-5">
                        Establezca la imagen en miniatura del producto. Solo se aceptan archivos *.png, *.jpg y *.jpeg.
                    </p>
                </v-card-item>
            </v-card>

            <!-- Status -->
            <v-card elevation="10" class="mb-6">
                <v-card-item>
                    <div class="d-flex align-center justify-space-between">
                        <h5 class="text-h5">Estatus</h5>
                        <v-avatar size="12" v-if="estatusModel === 'ACTIVO'" class="bg-success rounded-circle"></v-avatar>
                        <v-avatar size="12" v-else-if="estatusModel === 'INACTIVO'" class="bg-error rounded-circle"></v-avatar>
                        <v-avatar size="12" v-else class="bg-warning rounded-circle"></v-avatar> <!-- For other potential states -->
                    </div>
                    <div class="mt-5">
                        <v-select 
                            v-model="estatusModel"
                            :items="estatusItems"
                            variant="outlined"
                            label="Seleccione un estatus"
                            :error-messages="estatusError"
                            @update:modelValue="handleEstatusChange"
                        />
                        <p class="text-12 textSecondary mt-n3">Establecer el estado del producto.</p>
                    </div>
                </v-card-item>
            </v-card>

            <!-- Product Details
            <v-card elevation="10" class="mb-6">
                <v-card-item>
                    <h5 class="text-h5">Product Details</h5>
                    <div class="mt-5">
                        <v-label class="font-weight-medium mb-2">Categories</v-label>
                        <v-select v-model="selectmultiple" :items="itemsmultiple" placeholder="Select an option" chips multiple></v-select>
                        <p class="text-12 textSecondary mt-n4 mb-4">Añadir producto a una categoría.</p>
                        <v-btn variant="tonal" color="primary"><span class="text-20 me-1">+</span> Crear nueva categoría</v-btn>
                    </div>
                    <div class="mt-8">
                        <v-label class="font-weight-medium mb-2">Tags</v-label>
                        <v-combobox
                            variant="outlined"
                            color="primary"
                            density="comfortable"
                            v-model="tagsselect"
                            :items="tagsitems"
                            chips
                            multiple
                        ></v-combobox>
                        <p class="text-12 textSecondary mt-n4">Agregar etiquetas a un producto.</p>
                    </div>
                </v-card-item>
            </v-card> -->
            <!-- Weekly Sales
            <v-card elevation="10" class="mb-6">
                <v-card-item>
                    <h5 class="text-h5 mb-5">Product Template</h5>
                    <v-label class="font-weight-medium mb-2">Seleccione una plantilla de producto</v-label>
                    <v-select
                        :v-model="templateselect"
                        :items="templateitems"
                        variant="outlined"
                        class="text-body-1"
                        placeholder="Default template"
                        hide-details
                        color="primary"
                    ></v-select>
                    <p class="text-12 textSecondary mt-1">
                        Asigna una plantilla de tu administrador actual para definir cómo se muestra un solo producto.
                    </p>
                </v-card-item>
            </v-card> -->
        </div>
    </div>
</template>
