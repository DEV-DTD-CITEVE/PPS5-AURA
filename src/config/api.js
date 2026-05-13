const DEFAULT_API_BASE_URL = "http://localhost:8000";

const normalizeBaseUrl = (value) => {
    if (typeof value !== "string") {
        return DEFAULT_API_BASE_URL;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return DEFAULT_API_BASE_URL;
    }

    return trimmed.replace(/\/$/, "");
};

export const getApiBaseUrl = () =>
    normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL ?? DEFAULT_API_BASE_URL);

export default getApiBaseUrl;
