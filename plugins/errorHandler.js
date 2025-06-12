export default defineNuxtPlugin((nuxtApp) => {
    const toast = useToast()

    nuxtApp.hook('vue:error', (error, instance, info) => {
        toast.add({
            title: 'En kritisk ukendt fejl opstod',
            description: 'Der opstod en uventet fejl. Prøv venligst igen senere.',
            color: 'error',
            icon: 'i-mdi-alert'
        })
    })
})