const DEFAULT_API_BASE_URL = "http://localhost:8055";

const hasOwnEnvValue = (name) =>
    Object.prototype.hasOwnProperty.call(process.env, name);

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

export const getApiBaseUrl = () =>
    hasOwnEnvValue("REACT_APP_API_BASE_URL")
        ? normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL)
        : DEFAULT_API_BASE_URL;

export default getApiBaseUrl;
