const DEFAULT_API_BASE_URL = "http://localhost:8055";

const normalizeBaseUrl = (value) => {
    if (typeof value !== "string") {
        return DEFAULT_API_BASE_URL;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }

    return trimmed.replace(/\/$/, "");
};

const getNonEmptyEnvBaseUrl = (name) => {
    const value = normalizeBaseUrl(process.env[name]);
    return value || null;
};

const isLocalFrontendHost = (hostname) =>
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

export const getBrowserHostApiBaseUrl = () => {
    if (typeof window === "undefined" || !window.location?.hostname) {
        return null;
    }

    return isLocalFrontendHost(window.location.hostname)
        ? "http://localhost:8055"
        : `http://${window.location.hostname}:8055`;
};

export const getApiBaseUrl = () =>
    getNonEmptyEnvBaseUrl("REACT_APP_API_BASE_URL") ??
    getBrowserHostApiBaseUrl() ??
    DEFAULT_API_BASE_URL;

export const getRealtimeBaseUrl = () =>
    getNonEmptyEnvBaseUrl("REACT_APP_REALTIME_BASE_URL") ??
    getBrowserHostApiBaseUrl() ??
    DEFAULT_API_BASE_URL;

export default getApiBaseUrl;
