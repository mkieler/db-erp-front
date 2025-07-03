export const inventoryService = () => {
    const client = useSanctumClient();
    const resource = 'inventory/products';
    const toast = useToast();
    const { httpErrorText } = useHelpers();

    return {
        getProducts: async (filters = {}) => {
            try {
                return await client(resource, { params: filters });
            } catch (error) {
                toast.add({ 
                    title: 'Fejl ved indlæsning af produkter', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
            }
        },

        updateOrCreate: async (payload) => {
            try {
                const response = await client(resource, { method: 'POST', body: payload });
                toast.add({ 
                    title: 'Bruger oprettet', 
                    description: response.message, 
                    color: 'success', 
                    icon: 'i-mdi-check' 
                });
                return true;
            } catch (error) {
                toast.add({ 
                    title: 'Der skete en fejl', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
                return false;
            }
        },

        addStock: async (id, qty) => {
            try {
                const response = await client(`${resource}/${id}/add-stock`, { 
                    method: 'POST', 
                    body: { quantity: qty }
                 });
                toast.add({ 
                    title: 'Produkter tilføjet til lager', 
                    description: response.message, 
                    color: 'success', 
                    icon: 'i-mdi-check' 
                });
                return true;
            } catch (error) {
                toast.add({ 
                    title: 'Der skete en fejl', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
                return false;
            }
        },

        remove: async (id) => {
            try {
                const response = await client(`${resource}/${id}`, { method: 'DELETE' });
                toast.add({ 
                    title: 'Bruger slettet', 
                    description: response.message, 
                    color: 'success', 
                    icon: 'i-mdi-check' 
                });
                return true;
            } catch (error) {
                toast.add({ 
                    title: 'Der skete en fejl', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
                return false;
            }
        },
        
        bulkUpdate: async (payload) => {
            try {
                const response = await client(`${resource}/bulk`, { method: 'PUT', body: payload });
                toast.add({ 
                    title: 'Produkter opdateret', 
                    description: response.message, 
                    color: 'success', 
                    icon: 'i-mdi-check' 
                });
                return true;
            } catch (error) {
                toast.add({ 
                    title: 'Der skete en fejl', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
                return false;
            }
        },

        bulkDelete: async (ids) => {
            try {
                const response = await client(`${resource}/bulk`, { method: 'DELETE', body: { ids: ids } });
                toast.add({ 
                    title: 'Brugerene blev slettet', 
                    description: response.message, color: 
                    'success', 
                    icon: 'i-mdi-check' 
                });
                return true;
            } catch (error) {
                toast.add({ 
                    title: 'Der skete en fejl', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
                return false;
            }
        },

        getActivities: async (productId, filters = {}) => {
            try {
                return await client(`inventory/products/${productId}/activities`, { params: filters });
            } catch (error) {
                toast.add({ 
                    title: 'Fejl ved indlæsning af aktiviteter', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
            }
        }
    };
}