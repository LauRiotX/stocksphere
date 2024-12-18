import api from './Api';

export const fetchTranslations = async (lang: string): Promise<Record<string, string>> => {
    console.log(`Fetching translations for language: ${lang}`);
    try {
        // Make API request to get translations for the specified language
        const response = await api.get(`/api/translations/${lang}`);
        
        // Log successful response
        console.log(`Successfully fetched translations for language: ${lang}`, response.data);
        
        // Cache translations in localStorage for offline use
        try {
            localStorage.setItem(`translations_${lang}`, JSON.stringify(response.data));
        } catch (cacheError) {
            console.warn('Failed to cache translations:', cacheError);
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching translations for language ${lang}:`, error);

        // Try to get cached translations if network request fails
        try {
            const cachedTranslations = localStorage.getItem(`translations_${lang}`);
            if (cachedTranslations) {
                console.log('Using cached translations');
                return JSON.parse(cachedTranslations);
            }
        } catch (cacheError) {
            console.warn('Failed to retrieve cached translations:', cacheError);
        }

        if (error.response) {
            // Handle different error status codes
            console.error(`Server responded with status ${error.response.status}:`, error.response.data);
            const status = error.response.status;
            if (status === 400) {
                throw new Error(`Unsupported language: ${lang}`);
            } else if (status === 404) {
                throw new Error(`Translation file not found for language: ${lang}`);
            } else {
                throw new Error(`Server error while fetching translations (${status}): ${error.response.data.error || 'Unknown error'}`);
            }
        } else if (error.request) {
            console.error('No response received from server. Full error:', error);
            throw new Error('Translation server is not responding. Please try again later.');
        } else {
            console.error('Error setting up the request:', error.message, '\nFull error:', error);
            throw new Error(`Failed to fetch translations: ${error.message}`);
        }
    }
};