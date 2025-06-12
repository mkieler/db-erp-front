export const accessService = () => {
    const client = useSanctumClient();
    const resource = 'user/accesses';
    const toast = useToast()


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
    }
}