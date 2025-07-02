export const activityService = () => {
    const client = useSanctumClient();
    const resource = 'activities';
    const toast = useToast();
    const { httpErrorText } = useHelpers();

    return {
        getActivityFilters: async () => {
            try {
                return await client(`${resource}/available-filters`);
            } catch (error) {
                toast.add({ 
                    title: 'Fejl ved indlæsning af brugeraktivitet filtre', 
                    description: httpErrorText(error), 
                    color: 'error', 
                    icon: 'i-mdi-alert' 
                });
            }
        }
    }
};