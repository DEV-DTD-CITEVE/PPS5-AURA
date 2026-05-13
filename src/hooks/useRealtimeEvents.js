import { useEffect, useRef, useState } from "react";

const STREAM_PATH = "/api/realtime/events";
const RECONNECT_DELAY_MS = 3000;
const CART_STATE_EVENT_NAMES = [
    "cart.state.updated",
    "cart_created",
    "cart_replaced",
    "cart_patched",
    "cart_status_updated",
    "compartment_patched",
];
const CART_DELETED_EVENT_NAMES = ["cart_deleted"];

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
                onReconnectSnapshotNeeded?.({
                    isReconnect: reconnectingRef.current,
                });
                reconnectingRef.current = false;
            };

            source.onerror = () => {
                closeStream();
                scheduleReconnect();
            };

            CART_STATE_EVENT_NAMES.forEach((eventName) => {
                source.addEventListener(eventName, (event) => {
                    const payload = parseEventData(event);
                    if (payload) {
                        onCartStateUpdated?.(payload);
                    }
                });
            });

            CART_DELETED_EVENT_NAMES.forEach((eventName) => {
                source.addEventListener(eventName, (event) => {
                    const payload = parseEventData(event);
                    if (payload) {
                        onCartDeleted?.(payload);
                    }
                });
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
