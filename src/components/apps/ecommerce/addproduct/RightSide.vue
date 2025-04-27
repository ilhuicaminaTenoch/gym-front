<script setup lang="ts">
import { ref } from 'vue';
import preview from '@/assets/images/backgrounds/preview-img.png';
import api from '@/utils/axios';
import { useSnackbar } from '@/composables/useSnackbar';
import { useProductStore } from '@/stores/apps/product';


const { showSuccess, showError } = useSnackbar();
const productStore = useProductStore();

const fileInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string>(productStore.product.imagen || '');
const selectedFile = ref<File | null>(null);

const sku = ref(productStore.product.sku);
const codigoBarras = ref(productStore.product.codigoBarras);
const stock = ref(productStore.product.stock);
const estatus = ref(productStore.product.estatus || 'ACTIVO');




const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // Validate file size and type (optional)
    if (file.size > 1024 * 1024 * 5) {
        alert('¡El tamaño del archivo es demasiado grande! Se permiten 5 MB como máximo.');
        return;
    }

    selectedFile.value = file;

    // Read and display image preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Handle actual upload logic (needs server-side implementation)
    // ...
};

function saveRightSide() {
    // Aquí podrías agregar la lógica de subida de archivo si es necesaria.
    productStore.updateRightSide({
        imagen: imageUrl.value,
        sku: sku.value,
        codigoBarras: codigoBarras.value,
        stock: stock.value.toString(),
        estatus: estatus.value,
    });
    showSuccess('Datos secundarios actualizados');
}


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
                        <v-avatar size="12" v-if="select == 'Published'" class="bg-success rounded-circle"></v-avatar>
                        <v-avatar size="12" v-else-if="select == 'Draft'" class="bg-error rounded-circle"></v-avatar>
                        <v-avatar size="12" v-else-if="select == 'Scheduled'" class="bg-primary rounded-circle"></v-avatar>
                        <v-avatar size="12" v-else class="bg-warning rounded-circle"></v-avatar>
                    </div>
                    <div class="mt-5">
                        <v-select v-model="select" variant="outlined" :items="['Published', 'Draft', 'Scheduled', 'Inactive']"></v-select>
                        <!-- <v-select v-model="select" :items="items" variant="outlined" class="text-body-1" hide-details></v-select> -->
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
