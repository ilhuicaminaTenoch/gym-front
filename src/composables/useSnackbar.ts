import { ref } from 'vue'

const snackbar = ref({
    visible: false,
    color: 'success',
    text: '',
    timeout: 3000,
    icon: ''
})

export function useSnackbar() {
    const show = (text: string, color: string = 'success', icon: string = '') => {
        snackbar.value.text = text
        snackbar.value.color = color
        snackbar.value.icon = icon
        snackbar.value.visible = true
    }

    return {
        snackbar,
        showSuccess: (msg: string) => show(msg, 'success', 'mdi-check-circle'),
        showError: (msg: string) => show(msg, 'error', 'mdi-alert-circle'),
        showInfo: (msg: string) => show(msg, 'info', 'mdi-information'),
    }
}
