import { useEffect, useRef, useState } from "react";

const STREAM_PATH = "/events";
const RECONNECT_DELAY_MS = 3000;

const buildStreamUrl = (apiBaseUrl) => {
    const baseUrl = typeof apiBaseUrl === "string" ? apiBaseUrl.trim() : "";
    if (!baseUrl) {
        return STREAM_PATH;
    }

    return `${baseUrl.replace(/\/$/, "")}${STREAM_PATH}`;
};

const parseEventData = (event) => {
    if (!event || typeof event.data !== "string" || event.data.trim() === "") {
        return null;
    }

    try {
        return JSON.parse(event.data);
    } catch (error) {
        console.error("Erro ao processar evento realtime:", error);
        return null;
    }
};

const useRealtimeEvents = ({
    apiBaseUrl,
    onCartStateUpdated,
    onCartDeleted,
    onReconnectSnapshotNeeded,
} = {}) => {
    const [status, setStatus] = useState("connecting");
    const reconnectTimerRef = useRef(null);
    const eventSourceRef = useRef(null);
    const reconnectingRef = useRef(false);

    useEffect(() => {
        let isActive = true;

        const clearReconnectTimer = () => {
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
        };

        const closeStream = () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };

        const scheduleReconnect = () => {
            if (!isActive || reconnectTimerRef.current) {
                return;
            }

            reconnectingRef.current = true;
            setStatus("disconnected");
            reconnectTimerRef.current = setTimeout(() => {
                reconnectTimerRef.current = null;
                connect();
            }, RECONNECT_DELAY_MS);
        };

        const connect = () => {
            if (!isActive || typeof EventSource === "undefined") {
                setStatus("unsupported");
                return;
            }

            clearReconnectTimer();
            closeStream();
            setStatus("connecting");

            const source = new EventSource(buildStreamUrl(apiBaseUrl));
            eventSourceRef.current = source;

            source.onopen = () => {
                if (!isActive) {
                    return;
                }

                setStatus("connected");
                if (reconnectingRef.current) {
                    reconnectingRef.current = false;
                    onReconnectSnapshotNeeded?.();
                }
            };

            source.onerror = () => {
                closeStream();
                scheduleReconnect();
            };

            source.addEventListener("cart_state_updated", (event) => {
                const payload = parseEventData(event);
                if (payload) {
                    onCartStateUpdated?.(payload);
                }
            });

            source.addEventListener("cart_deleted", (event) => {
                const payload = parseEventData(event);
                if (payload) {
                    onCartDeleted?.(payload);
                }
            });
        };

        connect();

        return () => {
            isActive = false;
            clearReconnectTimer();
            closeStream();
        };
    }, [apiBaseUrl, onCartDeleted, onCartStateUpdated, onReconnectSnapshotNeeded]);

    return { status };
};

export default useRealtimeEvents;
