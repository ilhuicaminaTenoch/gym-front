<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
/* import Logo from '@/layouts/full/logo/Logo.vue';
Social icons
import google from '@/assets/images/svgs/google-icon.svg';
import facebook from '@/assets/images/svgs/icon-facebook.svg'; */

import { registrarUsuario } from '@/utils/helpers/usuario-service'
const { showSuccess, showError } = useSnackbar()

const router = useRouter();

const checkbox = ref(false);
const valid = ref(true);
const show1 = ref(false);
const password = ref('');
const email = ref('');
const passwordRules = ref([
    (v: string) => !!v || 'Password is required',
    (v: string) => (v && v.length <= 10) || 'Password must be less than 10 characters'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
const fname = ref('');
const fnameRules = ref([
    (v: string) => !!v || 'Name is required',
    (v: string) => (v && v.length <= 10) || 'Name must be less than 10 characters'
]);

const handleSubmit = async () => {
    if (!valid.value) return;

    try {
        await registrarUsuario({
            username: fname.value, // o usa `username` si agregas un campo aparte
            email: email.value,
            password: password.value
        });

        showSuccess('¡Usuario registrado exitosamente!')

        await router.push('/auth/login'); // cambia al path que necesites
    } catch (error) {
        showError('Hubo un error al registrar el usuario.')
        console.error('Error en registro', error);
    }
}
</script>
<template>
    <v-row class="d-flex mb-3">
        <!-- <v-col cols="6" sm="6">
            <v-btn variant="outlined" size="large" class="border text-subtitle-1 text-gray200 font-weight-semibold" block>
                <img :src="google" height="16" class="mr-2" alt="google" />
                <span class="d-sm-flex d-none mr-1">Sign in with</span>Google
            </v-btn>
        </v-col>
        <v-col cols="6" sm="6">
            <v-btn variant="outlined" size="large" class="border text-subtitle-1 text-gray200 font-weight-semibold" block>
                <img :src="facebook" width="25" height="25" class="mr-1" alt="facebook" />
                <span class="d-sm-flex d-none mr-1">Sign in with</span>FB
            </v-btn>
        </v-col> -->
    </v-row>
    <!-- <div class="d-flex align-center text-center mb-6">
        <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
            <span class="bg-surface px-5 py-3 position-relative text-subtitle-1 text-grey100">or sign Up with</span>
        </div>  
    </div> -->
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="handleSubmit" class="mt-5">
        <v-label class="text-subtitle-1 font-weight-medium pb-2">usuario</v-label>
        <VTextField v-model="fname" :rules="fnameRules" required ></VTextField>
        <v-label class="text-subtitle-1 font-weight-medium pb-2">Email</v-label>
        <VTextField v-model="email" :rules="emailRules" required ></VTextField>
        <v-label class="text-subtitle-1 font-weight-medium pb-2">Contraseña</v-label>
        <VTextField
            v-model="password"
            :counter="10"
            :rules="passwordRules"
            required
            variant="outlined"
            type="password"
            color="primary"
        ></VTextField>
        <v-btn size="large" class="mt-2" color="primary" block submit rounded="pill" type="submit">Registrarse</v-btn>
    </v-form>
</template>
