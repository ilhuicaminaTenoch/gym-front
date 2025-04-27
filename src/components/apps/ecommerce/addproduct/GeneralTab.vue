<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import StarterKit from '@tiptap/starter-kit';
import { ref } from 'vue';
import { InfoCircleIcon } from 'vue-tabler-icons';
import { useProductStore } from '@/stores/apps/product';


const productStore = useProductStore();
const nombre = ref(productStore.product.nombre);
const precio = ref(productStore.product.precio);
const editor = useEditor({
    extensions: [StarterKit],
    content: productStore.product.descripcion || ''
});

function saveGeneral() {
    productStore.setGeneralData({
        nombre: nombre.value,
        precio: precio.value.toString(),
        descripcion: editor?.value?.getHTML() || ''
    });
    alert('Información general guardada. Ahora puede acceder a RightSide.');
}
</script>
<template>
    <div class="pa-1 pt-0">
        <!-- General -->
        <v-card elevation="10" class="mb-6">
            <v-card-item>
                <h5 class="text-h5 mb-8">General</h5>
                <v-row class="d-flex flex-cols gap-3">
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Nombre del Producto <span class="text-error ms-1">*</span></v-label>
                        <VTextField type="text" placeholder="Product Name" variant="outlined" hide-details v-model="nombre"></VTextField>
                        <p class="textSecondary text-12 mt-1">Se requiere un nombre de producto y se recomienda que sea único.</p>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Descripción</v-label>
                        <v-card variant="outlined">
                            <div v-if="editor">
                                <EditorMenubar :editor="editor" class="border-b" />
                            </div>
                            <editor-content :editor="editor" style="min-height: 150px" />
                        </v-card>
                        <p class="textSecondary text-12 mt-1">Establezca una descripción al producto para una mejor visibilidad.</p>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <!-- Media
        <v-card elevation="10" class="mb-6">
            <v-card-text>
                <h5 class="text-h5 mb-8">Media</h5>
                <v-file-input
                    color="primary"
                    label="Drop files here or click to upload."
                    placeholder="Select your files"
                    prepend-icon="mdi-paperclip"
                    variant="outlined"
                    chips
                    multiple
                ></v-file-input>
            </v-card-text>
        </v-card> -->

        <!-- Pricing -->
        <v-card elevation="10" class="mb-6">
            <v-card-text>
                <h5 class="text-h5 mb-8">Precios</h5>
                <v-row class="d-flex flex-cols gap-3">
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Precio base <span class="text-error ms-1">*</span></v-label>
                        <VTextField type="text" placeholder="Product price" variant="outlined" hide-details v-model="precio"></VTextField>
                        <p class="textSecondary text-12 mt-1">Establecer el precio del producto.</p>
                    </v-col>
<!--                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <v-label class="font-weight-medium mb-2 me-1 ">Discount Type </v-label>
                            <v-menu open-on-hover location="top">
                                <template v-slot:activator="{ props }">
                                    <RouterLink to="#" v-bind="props" class="textSecondary" icon>
                                        <InfoCircleIcon height="15" />
                                    </RouterLink>
                                </template>
                                <v-sheet rounded="sm" width="180" class="pa-4 text-center text-body-2" elevation-10>
                                    Select a discount type that will be applied to this product
                                </v-sheet>
                            </v-menu>
                        </div>

                        <v-radio-group v-model="discount">
                            <div class="d-sm-flex d-block gap-3 justify-space-between">
                                <div class="py-3 px-3 w-100 border border-dashed rounded-md mb-6">
                                    <v-radio value="no-discount" color="primary">
                                        <template v-slot:label>
                                            <div class="d-flex align-center w-100">
                                                <h6 class="text-h6">No Discount</h6>
                                            </div>
                                        </template>
                                    </v-radio>
                                </div>

                                <div class="py-3 px-3 w-100 border border-dashed rounded-md mb-6">
                                    <v-radio value="percent" color="primary">
                                        <template v-slot:label>
                                            <h6 class="text-h6">Percentage %</h6>
                                        </template>
                                    </v-radio>
                                </div>

                                <div class="py-3 px-3 w-100 border border-dashed rounded-md mb-6">
                                    <v-radio value="fixed" color="primary">
                                        <template v-slot:label>
                                            <h6 class="text-h6">Fixed Price</h6>
                                        </template>
                                    </v-radio>
                                </div>
                            </div>
                        </v-radio-group>

                        &lt;!&ndash; if percent is selected &ndash;&gt;
                        <div v-if="discount == 'no-discount'">
                            <v-row>
                                <v-col cols="12" md="6" class="pt-0">
                                    <v-label class="font-weight-medium mb-2">Tax Class <span class="text-error ms-1">*</span></v-label>
                                    <v-select
                                        v-model="select"
                                        :items="items"
                                        variant="outlined"
                                        density="compact"
                                        class="text-body-1"
                                        hide-details
                                    ></v-select>
                                    <p class="textSecondary text-12 mt-1">Set the product tax class.</p>
                                </v-col>
                                <v-col cols="12" md="6" class="pt-0">
                                    <v-label class="font-weight-medium mb-2">VAT Amount (%) <span class="text-error ms-1">*</span></v-label>
                                    <VTextField type="text" placeholder="" variant="outlined" hide-details></VTextField>
                                    <p class="textSecondary text-12 mt-1">Set the product VAT about.</p>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-if="discount == 'percent'">
                            <v-row>
                                <v-col cols="12">
                                    <v-label class="font-weight-medium mb-2"
                                        >Set Discount Percentage <span class="text-error ms-1">*</span></v-label
                                    >
                                    <h3 class="text-h2 text-center">{{ slider }}</h3>
                                    <v-slider
                                        class="mt-3"
                                        v-model="slider"
                                        hide-details
                                        color="primary"
                                        step="10"
                                        show-ticks="always"
                                        thumb-label="always"
                                    ></v-slider>
                                    <p class="textSecondary text-12 mt-1">Set a percentage discount to be applied on this product.</p>
                                </v-col>
                            </v-row>
                            <v-row class="mt-6">
                                <v-col cols="12" md="6" class="pt-0">
                                    <v-label class="font-weight-medium mb-2">Tax Class <span class="text-error ms-1">*</span></v-label>
                                    <v-select
                                        v-model="select"
                                        :items="items"
                                        variant="outlined"
                                        density="compact"
                                        class="text-body-1"
                                        hide-details
                                    ></v-select>
                                    <p class="textSecondary text-12 mt-1">Set the product tax class.</p>
                                </v-col>
                                <v-col cols="12" md="6" class="pt-0">
                                    <v-label class="font-weight-medium mb-2">VAT Amount (%) <span class="text-error ms-1">*</span></v-label>
                                    <VTextField type="text" placeholder="" variant="outlined" hide-details></VTextField>
                                    <p class="textSecondary text-12 mt-1">Set the product VAT about.</p>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-if="discount == 'fixed'">
                            <v-row>
                                <v-col cols="12" class="pt-0 mb-3">
                                    <v-label class="font-weight-medium mb-2">Fixed Discounted Price</v-label>
                                    <VTextField type="text" placeholder="Discounted Price" variant="outlined" hide-details></VTextField>
                                    <p class="textSecondary text-12 mt-1">
                                        Set the discounted product price. The product will be reduced at the determined fixed price
                                    </p>
                                </v-col>
                                <v-col cols="12" md="6" class="pt-0">
                                    <v-label class="font-weight-medium mb-2">Tax Class <span class="text-error ms-1">*</span></v-label>
                                    <v-select
                                        v-model="select"
                                        :items="items"
                                        variant="outlined"
                                        density="compact"
                                        class="text-body-1"
                                        hide-details
                                    ></v-select>
                                    <p class="textSecondary text-12 mt-1">Set the product tax class.</p>
                                </v-col>
                                <v-col cols="12" md="6" class="pt-0">
                                    <v-label class="font-weight-medium mb-2">VAT Amount (%) <span class="text-error ms-1">*</span></v-label>
                                    <VTextField type="text" placeholder="" variant="outlined" hide-details></VTextField>
                                    <p class="textSecondary text-12 mt-1">Set the product VAT about.</p>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>-->
                </v-row>
            </v-card-text>
        </v-card>
    </div>
    <div class="d-flex mb-md-0 mb-3 gap-3">
        <v-btn flat color="primary"> save changes </v-btn>
        <v-btn variant="tonal" color="error"> cancel </v-btn>
    </div>
</template>
