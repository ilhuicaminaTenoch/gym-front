<script setup lang="ts">
import { ref } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import StarterKit from '@tiptap/starter-kit';
import { XIcon } from 'vue-tabler-icons';
import { useProductStore } from '@/stores/apps/product';
const editor = useEditor({
    extensions: [StarterKit]
});
const checkbox = ref(false);
const shipping = ref(false);
const ship = ref(null);
const select = ref('Size');
const items = ref(['Color', 'Size', 'Material', 'Style']);

const productStore = useProductStore();
const sku = ref(productStore.product.sku);
const codigoBarras = ref(productStore.product.codigoBarras);
const stock = ref<number>(Number(productStore.product.stock || '0'));

function saveAdvance() {
    productStore.setAdvancedData({
        sku: sku.value,
        stock: stock.value.toString(),
        cantidad: stock.value,
        codigoBarras: codigoBarras.value
    });

}
</script>
<template>
    <div class="pa-1 pt-0">
        <!-- Inventory -->
        <v-card elevation="10" class="mb-6">
            <v-card-text>
                <h5 class="text-h5 mb-8">Inventario</h5>
                <v-row>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">SKU <span class="text-error ms-1">*</span></v-label>
                        <VTextField v-model="sku" type="text" placeholder="SKU" variant="outlined" hide-details></VTextField>
                        <p class="textSecondary text-12 mt-1">Ingrese el SKU del producto</p>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Codigo de Barras <span class="text-error ms-1">*</span></v-label>
                        <VTextField v-model="codigoBarras" type="text" placeholder="Número de código de barras" variant="outlined" hide-details></VTextField>
                        <p class="textSecondary text-12 mt-1">Introduzca el número de código de barras del producto.</p>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-label class="font-weight-medium mb-2">Cantidad <span class="text-error ms-1">*</span></v-label>
                        <VTextField v-model="stock" type="number" variant="outlined" hide-details></VTextField>
                        <p class="textSecondary text-12 mt-1">Introduzca la cantidad del producto</p>
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

        <!-- Variations -->
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

        <!-- Shipping
        <v-card elevation="10" class="mb-6">
            <v-card-text>
                <h5 class="text-h5 mb-4">Shipping</h5>
                <div class="d-flex flex-wrap align-center ml-n2">
                    <v-checkbox class="pe-2" v-model="ship" required hide-details color="primary" value="ship">
                        <template v-slot:label class="font-weight-medium">This is a physical product</template>
                    </v-checkbox>
                </div>
                <p class="textSecondary text-12 mt-n2">
                    Set if the product is a physical or digital item. Physical products may require shipping.
                </p>
                <div v-if="ship == 'ship'" class="mt-8">
                    <v-row>
                        <v-col cols="12" class="pt-0 mb-3">
                            <v-label class="font-weight-medium mb-2">Weight</v-label>
                            <VTextField type="text" placeholder="Product weight" variant="outlined" hide-details></VTextField>
                            <p class="textSecondary text-12 mt-1">Set a product weight in kilograms (kg).</p>
                        </v-col>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Dimension</v-label>
                            <div class="d-md-flex gap-3 mb-md-0 mb-3">
                                <VTextField type="number" placeholder="Width (w)" variant="outlined" hide-details></VTextField>
                                <VTextField type="number" placeholder="Height (h)" variant="outlined" hide-details></VTextField>
                                <VTextField type="number" placeholder="Lengtn (l)" variant="outlined" hide-details></VTextField>
                            </div>
                            <p class="textSecondary text-12 mt-1">Enter the product dimensions in centimeters (cm).</p>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
        </v-card> -->

        <!-- Meta Options
        <v-card elevation="10" class="mb-6">
            <v-card-text>
                <h5 class="text-h5 mb-4">Meta Options</h5>
                <v-row>
                    <v-col cols="12" class="mb-3 mt-3">
                        <v-label class="font-weight-medium mb-2">Meta Tag Title</v-label>
                        <VTextField type="text" placeholder="Meta tag name" variant="outlined" hide-details></VTextField>
                        <p class="textSecondary text-12 mt-1">Set a meta tag title. Recommended to be simple and precise keywords.</p>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Meta Tag Description</v-label>
                        <v-card variant="outlined">
                            <div v-if="editor">
                                <EditorMenubar :editor="editor" class="border-b" />
                            </div>
                            <editor-content :editor="editor" />
                        </v-card>
                        <p class="textSecondary text-12 mt-1">Set a meta tag description to the product for increased SEO ranking.</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card> -->
    </div>
    <div class="d-flex mb-md-0 mb-3 gap-3">
        <v-btn flat color="primary" @click="saveAdvance"> save changes </v-btn>
        <v-btn variant="tonal" color="error"> cancel </v-btn>
    </div>
</template>
