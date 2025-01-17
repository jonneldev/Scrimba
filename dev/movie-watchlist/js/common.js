export const fetchFromAPI = async (url) => {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.error("API fetch error:", error);
        return null;
    }
};

export const displayError = (message, container) => {
    container.innerHTML = `<p class="error">${message}</p>`;
};

export const displayLoadingState = (container) => {
    container.innerHTML = `<p class="loading">Loading...</p>`;
};