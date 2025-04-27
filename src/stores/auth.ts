import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode'

import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

interface DecodedToken {
    sub: string;
    userId: string;
    fullName: string;
    email: string;
    rol: string;
}

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        token: localStorage.getItem('user') || null,
        user: null as null | { fullName: string; username: string; userId: number; email: string; rol: string },
        returnUrl: null as string | null
    }),
    actions: {
        setToken(newToken: string) {
            this.token = newToken;
            localStorage.setItem('user', newToken);
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem('user');
        },
        async login(username: string, password: string) {
            const response = await fetchWrapper.post(`${baseUrl}/login`, { usernameOrEmail: username, password });

            const decoded = jwtDecode<DecodedToken>(response.token)

            this.setToken(response.token);

            this.user = {
                fullName: decoded.fullName,
                username: decoded.sub,
                userId: parseInt(decoded.userId),
                email: decoded.email,
                rol: decoded.rol
            };
            await router.push(this.returnUrl || '/dashboard1');
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('user');
            router.push('/');
        },
    }
});
