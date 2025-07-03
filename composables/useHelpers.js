export const useHelpers = () => {

    function httpErrorText(error) {
        return error.response?._data?.message 
            || error.response?.statusText 
            || 'Der opstod en fejl. Prøv venligst igen senere.';
    }

    function userCan(permission) {
        const user = useSanctumUser();
        return user?.value?.accesses?.some(access => access.type === permission) || false;
    }

    return {
        httpErrorText,
        userCan
    };
};