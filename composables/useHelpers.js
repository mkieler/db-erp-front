export const useHelpers = () => {

    function httpErrorText(error) {
        return error.response?._data?.message 
            || error.response?.statusText 
            || 'Der opstod en fejl. Prøv venligst igen senere.';
    }
    return {
        httpErrorText,
    };
};