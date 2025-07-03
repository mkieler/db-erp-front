export const statisticsService = () => {
    const client = useSanctumClient();
    const resource = 'statistics';
    const toast = useToast();
    const { httpErrorText } = useHelpers();

    return {
        getWarnings: async () => {
            try {
                return await client(`${resource}/warnings`);
            } catch (error) {
                toast.add({ 
                    title: 'Fejl ved indlæsning af advarsler',
                    description: httpErrorText(error),
                    color: 'error',
                    icon: 'i-mdi-alert'
                });
            }
        },

        getTotalProducts: async () => {
            try {
                return await client(`${resource}/total-products`);
            } catch (error) {
                toast.add({ 
                    title: 'Fejl ved indlæsning af samlede produkter',
                    description: httpErrorText(error),
                    color: 'error',
                    icon: 'i-mdi-alert'
                });
            }
        },

        getTotalUsers: async () => {
            try {
                return await client(`${resource}/total-users`);
            } catch (error) {
                toast.add({ 
                    title: 'Fejl ved indlæsning af samlede brugere',
                    description: httpErrorText(error),
                    color: 'error',
                    icon: 'i-mdi-alert'
                });
            }
        }
    }
};