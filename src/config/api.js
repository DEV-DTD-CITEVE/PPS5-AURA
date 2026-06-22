const DEFAULT_DEV_API_BASE_URL = "http://localhost:8055";

const normalizeBaseUrl = (value) => {
    if (typeof value !== "string") {
        return "";
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

const isProductionBuild = process.env.NODE_ENV === "production";

export const getBrowserHostApiBaseUrl = () => {
    if (isProductionBuild || typeof window === "undefined" || !window.location?.hostname) {
        return "";
    }

    return isLocalFrontendHost(window.location.hostname)
        ? DEFAULT_DEV_API_BASE_URL
        : `http://${window.location.hostname}:8055`;
};

export const getApiBaseUrl = () =>
    getNonEmptyEnvBaseUrl("REACT_APP_API_BASE_URL") ??
    getBrowserHostApiBaseUrl() ??
    "";

export const getRealtimeBaseUrl = () =>
    getNonEmptyEnvBaseUrl("REACT_APP_REALTIME_BASE_URL") ??
    getBrowserHostApiBaseUrl() ??
    "";

export default getApiBaseUrl;
