export const accessService = () => {
    const client = useSanctumClient();
    const resource = 'user/accesses';

    return {
        get: async (filters = {}) => {
            return client(resource, { params: filters });
        },
    }
}