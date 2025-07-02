export const imageService = () => {
    const client = useSanctumClient();
    const resource = 'images';
    const toast = useToast()
    const { httpErrorText } = useHelpers();


    return {
        get: async (filters = {}) => {
            try {
                return client(resource, { params: filters });
            } catch (error) {
                toast.add({ 
                    title: 'Der opstod en fejl da adgangsdata skulle hentes', 
                    description: httpErrorText(error), 
                    color: 'error', icon: 'i-mdi-alert' 
                });
            }
        },
        upload: async (file) => {
            try {
                const formData = new FormData();
                formData.append('image', file);
                return client(
                    resource, 
                    { method: 'POST', body: formData }
                );
            } catch (error) {
                console.log(error);
                toast.add({ 
                    title: 'Der opstod en fejl da billedet skulle uploades', 
                    description: httpErrorText(error), 
                    color: 'error', icon: 'i-mdi-alert' 
                });
            }
        },
    }
}