<script setup lang="ts">
import { ref } from 'vue';
import GeneralTab from './GeneralTab.vue';
import AdvanceTab from './AdvanceTab.vue';
import { useProductStore } from '@/stores/apps/product';
const tab = ref(0);
const productStore = useProductStore();
</script>
<template>
    <v-tabs v-model="tab" bg-color="transparent" height="60" color="primary" class="mb-8">
        <v-tab value="General" class="text-h6"> General</v-tab>
        <v-tab :disabled="!productStore.generalSaved" value="Advanced" class="text-h6">Advanzado</v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item value="General"><GeneralTab /></v-window-item>
        <v-window-item value="Advanced"><AdvanceTab/></v-window-item>
    </v-window>
</template>
