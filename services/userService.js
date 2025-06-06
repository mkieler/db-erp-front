export const userService = () => {
    const client = useSanctumClient();
    const { login, logout } = useSanctumAuth();
    const resource = 'users';
    const toast = useToast()

    return {
        login: async (userCredentials) => {
            try {
                const {} = await login(userCredentials);
                toast.add({ title: 'Du er nu logget ind', description: 'Velkommen tilbage!', color: 'success', icon: 'i-mdi-check' });
            } catch (error) {
                console.log(error);
                toast.add({ title: 'Login fejlede', description: error.response?._data?.message, color: 'error', icon: 'i-mdi-alert' });
            }
        },
        logout: async () => {
            try {
                await logout();
                toast.add({ title: 'Du er nu logget ud', description: 'Vi håber at se dig igen!', color: 'success', icon: 'i-mdi-check' });
            } catch (error) {
                toast.add({ title: 'Logout fejlede', description: error.response?._data?.message, color: 'error', icon: 'i-mdi-alert' });
            }
        },
        get: async (filters = {}) => {
            try {
                return await client(resource, { params: filters });
            } catch (error) {
                toast.add({ title: 'Fejl ved indlæsning af brugere', description: error.response?._data?.message, color: 'error', icon: 'i-mdi-alert' });
                throw error;
            }
        },
        updateOrCreate: async (payload) => {
            try {
                const response = await client(resource, { method: 'POST', body: payload });
                console.log(response);
                toast.add({ title: 'Bruger oprettet', description: response.message, color: 'success', icon: 'i-mdi-check' });
                return true;
            } catch (error) {
                toast.add({ title: 'Der skete en fejl', description: error.response._data.message, color: 'error', icon: 'i-mdi-alert' });
                return false;
            }
        },
        remove: async (id) => {
            try {
                const response = await client(`${resource}/${id}`, { method: 'DELETE' });
                toast.add({ title: 'Bruger slettet', description: response.message, color: 'success', icon: 'i-mdi-check' });
                return true;
            } catch (error) {
                toast.add({ title: 'Der skete en fejl', description: error.response._data.message, color: 'error', icon: 'i-mdi-alert' });
                return false;
            }
        },
        bulkUpdate: async (payload) => {
            try {
                const response = await client(`${resource}/bulk`, { method: 'PUT', body: payload });
                toast.add({ title: 'Brugere opdateret', description: response.message, color: 'success', icon: 'i-mdi-check' });
                return true;
            } catch (error) {
                toast.add({ title: 'Der skete en fejl', description: error.response._data.message, color: 'error', icon: 'i-mdi-alert' });
                return false;
            }
        },
        bulkDelete: async (ids) => {
            try {
                const response = await client(`${resource}/bulk`, { method: 'DELETE', body: { userIds: ids } });
                toast.add({ title: 'Brugerene blev slettet', description: response.message, color: 'success', icon: 'i-mdi-check' });
                return true;
            } catch (error) {
                toast.add({ title: 'Der skete en fejl', description: error.response._data.message, color: 'error', icon: 'i-mdi-alert' });
                return false;
            }
        }
    };
}