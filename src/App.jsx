import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import CartCard from "./components/CartCard/cartCard";
import NotificationToast from "./components/others/notificationToast";
import Header from "./components/others/header";
import AddCartModal from "./components/others/addCartModal";
import Footer from "./components/others/footer";
import Sidebar from "./components/others/sidebar";
import axios from "axios";
import useRealtimeEvents from "./hooks/useRealtimeEvents";
import { getApiBaseUrl } from "./config/api";

const API_BASE_URL = getApiBaseUrl();

export const mapCompartmentsFromObject = (compartmentsObject = {}) =>
    Object.entries(compartmentsObject).map(([key, c]) => ({
        name: key,
        piece_type: c?.piece_type,
        piece_count: c?.piece_count,
        max_pieces: c?.max_pieces,
        piece_image: c?.piece_image,
    }));

const mapCartFromApi = (cart) => {
    const compartments = mapCompartmentsFromObject(cart.compartments);
    const itemsCount = compartments.reduce((sum, c) => sum + (c.piece_count || 0), 0);

    return { id: cart.id, title: cart.id, compartments, itemsCount };
};

const extractRealtimeCandidate = (payload) => payload?.payload ?? payload?.cart ?? payload?.data ?? payload;

export const normalizeRealtimeCart = (payload, existingCarts) => {
    const candidate = extractRealtimeCandidate(payload);

    if (!candidate || typeof candidate !== "object") {
        return null;
    }

    const id =
        candidate.id ??
        candidate.cartId ??
        candidate.cart_id ??
        payload?.aggregate_id ??
        payload?.cart_id;
    if (typeof id !== "string" || id.trim() === "") {
        return null;
    }

    let rawCompartments = null;
    if (Array.isArray(candidate.compartments)) {
        rawCompartments = candidate.compartments;
    } else if (
        candidate.compartments &&
        typeof candidate.compartments === "object" &&
        !Array.isArray(candidate.compartments)
    ) {
        rawCompartments = mapCompartmentsFromObject(candidate.compartments);
    }

    if (!rawCompartments || rawCompartments.length === 0) {
        return null;
    }

    const existingCart = existingCarts.find((cart) => cart.id === id);
    const imageByName = new Map(
        (existingCart?.compartments || []).map((compartment) => [
            compartment.name,
            compartment.piece_image,
        ]),
    );

    const compartments = rawCompartments
        .map((compartment) => {
            if (!compartment || typeof compartment !== "object") {
                return null;
            }

            const name = compartment.name;
            const pieceCount = compartment.piece_count;
            const maxPieces = compartment.max_pieces;

            if (
                typeof name !== "string" ||
                typeof pieceCount !== "number" ||
                typeof maxPieces !== "number"
            ) {
                return null;
            }

            return {
                name,
                piece_type: compartment.piece_type,
                piece_count: pieceCount,
                max_pieces: maxPieces,
                piece_image: compartment.piece_image ?? imageByName.get(name),
            };
        })
        .filter(Boolean);

    if (compartments.length !== rawCompartments.length) {
        return null;
    }

    return {
        id,
        title: id,
        compartments,
        itemsCount: compartments.reduce((sum, c) => sum + c.piece_count, 0),
    };
};

export const mergeCartStateFromRealtime = (currentCarts, payload) => {
    const normalizedCart = normalizeRealtimeCart(payload, currentCarts);

    if (!normalizedCart) {
        return { didMerge: false, carts: currentCarts };
    }

    const cartExists = currentCarts.some((cart) => cart.id === normalizedCart.id);

    return {
        didMerge: true,
        carts: cartExists
            ? currentCarts.map((cart) =>
                  cart.id === normalizedCart.id ? { ...cart, ...normalizedCart } : cart,
              )
            : [...currentCarts, normalizedCart].sort((a, b) => a.id.localeCompare(b.id)),
    };
};

export async function sendToCart(cartId) {
  const res = await fetch(`/api/carts/${cartId}/commands/send-to-cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Erro ao enviar AMR");
  }

  return res.json();
}


const App = () => {
    const [carts, setCarts] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [showAddCartModal, setShowAddCartModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        cartId: null,
        cartTitle: "",
    });
    const [pickupModal, setPickupModal] = useState({
        isOpen: false,
        cartId: null,
        cartTitle: "",
    });
    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        cart: null,
        startEditing: false,
    });
    const [currentPage, setCurrentPage] = useState("Gestão de Carrinhos");
    const [streamReconnectToastShown, setStreamReconnectToastShown] = useState(false);
    const contentRef = useRef(null);
    const cartsRef = useRef([]);

    // Função para exibir toast
    const showToast = useCallback((variant, title, message, position = "top") => {
        const toast = { id: Date.now(), variant, title, message, position };
        setToasts((prev) => [...prev, toast]);
        setTimeout(
            () => setToasts((prev) => prev.filter((t) => t.id !== toast.id)),
            4000,
        );
    }, []);

    // Fetch de carts
    const fetchCarts = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/carts`);
            const formatted = response.data
                .map((cart) => mapCartFromApi(cart))
                .sort((a, b) => a.id.localeCompare(b.id));

            setCarts((prev) => {
                const hasChanges = JSON.stringify(prev) !== JSON.stringify(formatted);
                return hasChanges ? formatted : prev;
            });
        } catch (error) {
            console.error("Erro ao buscar carts:", error);
            showToast("error", "Erro", "Não foi possível buscar os carrinhos.");
        }
    }, [showToast]);

    useEffect(() => {
        cartsRef.current = carts;
    }, [carts]);

    useEffect(() => {
        fetchCarts();
    }, [fetchCarts]);

    const handleRealtimeCartStateUpdated = useCallback(
        (payload) => {
            const mergeResult = mergeCartStateFromRealtime(cartsRef.current, payload);

            if (!mergeResult.didMerge) {
                fetchCarts();
                return;
            }

            cartsRef.current = mergeResult.carts;
            setCarts(mergeResult.carts);
        },
        [fetchCarts],
    );

    const handleRealtimeCartDeleted = useCallback(
        (payload) => {
            const cartId = payload?.id;

            if (typeof cartId !== "string" || !cartId.trim()) {
                fetchCarts();
                return;
            }

            const nextCarts = cartsRef.current.filter((cart) => cart.id !== cartId);

            if (nextCarts.length === cartsRef.current.length) {
                fetchCarts();
                return;
            }

            cartsRef.current = nextCarts;
            setCarts(nextCarts);
        },
        [fetchCarts],
    );

    const handleReconnectSnapshotNeeded = useCallback(({ isReconnect } = {}) => {
        fetchCarts();

        if (isReconnect && !streamReconnectToastShown) {
            showToast(
                "neutralBlue",
                "Realtime",
                "Ligação restabelecida. Estado sincronizado.",
                "bottom",
            );
            setStreamReconnectToastShown(true);
        }
    }, [fetchCarts, showToast, streamReconnectToastShown]);

    const { status: streamStatus } = useRealtimeEvents({
        apiBaseUrl: API_BASE_URL,
        onCartStateUpdated: handleRealtimeCartStateUpdated,
        onCartDeleted: handleRealtimeCartDeleted,
        onReconnectSnapshotNeeded: handleReconnectSnapshotNeeded,
    });

    useEffect(() => {
        if (streamStatus === "connected") {
            setStreamReconnectToastShown(false);
        }
    }, [streamStatus]);

    // Scroll ao topo
    const handleScrollToTop = useCallback(() => {
        if (contentRef.current)
            contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Descarregar carrinho
    const handleUnload = useCallback(
        (cartTitle) => {
            setCarts((prev) =>
                prev.map((cart) =>
                    cart.title === cartTitle
                        ? {
                            ...cart,
                            compartments: cart.compartments.map((c) => ({
                                ...c,
                                piece_count: 0,
                                percentage: 0,
                            })),
                            itemsCount: 0,
                        }
                        : cart,
                ),
            );
            showToast(
                "neutralBlue",
                "Robot",
                `O Robot iniciou a descarga do ${cartTitle}`,
            );
        },
        [showToast],
    );

    // Atualizar compartimentos
    const handleUpdate = useCallback(
        async (cartId, updatedCompartments) => {
            try {
                for (const compartment of updatedCompartments) {
                    await axios.patch(
                        `${API_BASE_URL}/carts/${cartId}/compartments/${compartment.name}`,
                        {
                            piece_type: compartment.piece_type,
                            piece_count: compartment.piece_count,
                            max_pieces: compartment.max_pieces,
                        },
                    );
                }

                // Atualiza o estado local só depois de tudo confirmar
                setCarts((prev) =>
                    prev.map((cart) =>
                        cart.id === cartId
                            ? {
                                ...cart,
                                compartments: updatedCompartments.map((c) => ({ ...c })), // clone cada compartimento
                                itemsCount: updatedCompartments.reduce(
                                    (sum, c) => sum + (c.piece_count || 0),
                                    0,
                                ),
                            }
                            : cart,
                    ),
                );
            } catch (error) {
                console.error("Erro ao atualizar compartimentos:", error);
                showToast(
                    "error",
                    "Erro",
                    "Não foi possível atualizar os compartimentos.",
                );
            }
        },
        [showToast],
    );

    // Adicionar carrinho
    const handleAddCart = useCallback(() => setShowAddCartModal(true), []);
    const handleConfirmAddCart = useCallback(
        async (newCart) => {
            try {
                await axios.post(`${API_BASE_URL}/carts`, newCart);
                showToast(
                    "success",
                    "Carrinho adicionado",
                    `${newCart.id} foi adicionado com sucesso.`,
                );
                fetchCarts();
            } catch (error) {
                console.error("Erro ao adicionar cart:", error);
                showToast("error", "Erro", `Não foi possível adicionar ${newCart.id}.`);
            } finally {
                setShowAddCartModal(false);
            }
        },
        [showToast, fetchCarts],
    );

    // Deletar carrinho
    const handleRequestDeleteCart = useCallback((cartId, cartTitle) => {
        setDeleteModal({ isOpen: true, cartId, cartTitle });
    }, []);
    const handleConfirmDeleteCart = useCallback(async () => {
        const { cartId, cartTitle } = deleteModal;
        try {
            await axios.delete(`${API_BASE_URL}/carts/${cartId}`);
            setCarts((prev) => prev.filter((cart) => cart.id !== cartId));
            showToast("success", "Carrinho eliminado", `${cartTitle} foi removido.`);
        } catch (error) {
            console.error("Erro ao eliminar cart:", error);
            showToast("error", "Erro", `Não foi possível eliminar ${cartTitle}.`);
        } finally {
            setDeleteModal({ isOpen: false, cartId: null, cartTitle: "" });
        }
    }, [deleteModal, showToast]);

    // Recolher carrinho
const handleRequestPickup = useCallback((cartId, cartTitle) => {
    setPickupModal({ isOpen: true, cartId, cartTitle });
}, []);



const handleConfirmPickup = useCallback(async () => {
    try {
        await sendToCart(pickupModal.cartId); 
        handleUnload(pickupModal.cartTitle);  
        setPickupModal({ isOpen: false, cartId: null, cartTitle: "" });
    } catch (err) {
        console.error("Erro ao enviar AMR:", err.message);
        showToast("error", "Erro", "Não foi possível enviar o AMR.");
    }
}, [pickupModal.cartId, pickupModal.cartTitle, handleUnload, showToast]);



    // Fechar modal de detalhe
    const handleCloseDetail = useCallback(() => {
        setDetailModal({ isOpen: false, cart: null, startEditing: false });
    }, []);

    return (
        <div className="App">
            <div className="app-header">
                <Header onClick={handleScrollToTop} currentPage={currentPage} />
            </div>

            <div className="app-body">
                <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
                <div className="app-content" ref={contentRef}>
                    {currentPage === "Gestão de Carrinhos" && (
                        <>
                            <div className="content-actions">
                                <div
                                    className={`stream-status-indicator is-${streamStatus}`}
                                    aria-live="polite"
                                    data-testid="stream-status-indicator"
                                >
                                    <span className="stream-status-dot" />
                                    <span className="stream-status-label">
                                        Stream: {streamStatus}
                                    </span>
                                </div>
                                <button
                                    className="action-btn add-cart-btn"
                                    onClick={handleAddCart}
                                    title="Adicionar novo carrinho"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 5v14M5 12h14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="cards-grid">
                                {carts.map((c) => (
                                    <div key={c.id} className="cart-card-wrapper">
                                        <CartCard
                                            title={c.title}
                                            itemsCount={c.itemsCount}
                                            compartments={c.compartments}
                                            piece_image={c.compartments[0]?.piece_image}
                                            onUnload={handleUnload}
                                            onUpdate={handleUpdate}
                                            onDelete={() => handleRequestDeleteCart(c.id, c.title)}
                                            onPickup={() => handleRequestPickup(c.id, c.title)}
                                            isCollapsed={true}
                                            onToggleCollapse={() =>
                                                setDetailModal({
                                                    isOpen: true,
                                                    cart: c,
                                                    startEditing: true,
                                                })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="app-footer">
                <Footer />
            </div>

            {/* Modal de detalhe */}
            {detailModal.isOpen && detailModal.cart && (
                <div className="confirm-modal-backdrop" onClick={handleCloseDetail}>
                    <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                        <CartCard
                            pickupModal={true} 
                            title={detailModal.cart.title}
                            itemsCount={detailModal.cart.itemsCount}
                            compartments={detailModal.cart.compartments}
                            onUnload={handleUnload}
                            onUpdate={(cartId, comps) => {
                                handleUpdate(cartId, comps);
                                handleCloseDetail();
                            }}
                            onDelete={() => {
                                handleRequestDeleteCart(
                                    detailModal.cart.id,
                                    detailModal.cart.title,
                                );
                                handleCloseDetail();
                            }}
                            onPickup={() => {
                                handleRequestPickup(
                                    detailModal.cart.id,
                                    detailModal.cart.title,
                                );
                                handleCloseDetail();
                            }}
                            initialEditing={detailModal.startEditing}
                            isCollapsed={false}
                            onToggleCollapse={handleCloseDetail}
                        />
                    </div>
                </div>
            )}

            {/* Modal de delete */}
            {deleteModal.isOpen && (
                <div className="confirm-modal-backdrop">
                    <div className="confirm-modal">
                        <h4>Eliminar Carrinho</h4>
                        <p>
                            Tem a certeza de que deseja eliminar{" "}
                            <strong>{deleteModal.cartTitle}</strong>?
                        </p>
                        <div className="confirm-modal-actions">
                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setDeleteModal({ isOpen: false, cartId: null, cartTitle: "" })
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                className="confirm-button"
                                onClick={handleConfirmDeleteCart}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de pickup */}
            {pickupModal.isOpen && (
                <div className="confirm-modal-backdrop">
                    <div className="confirm-modal">
                        <h4>Recolher Carrinho</h4>
                        <p>
                            Deseja recolher <strong>{pickupModal.cartTitle}</strong>?
                        </p>
                        <div className="confirm-modal-actions">
                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setPickupModal({ isOpen: false, cartId: null, cartTitle: "" })
                                }
                            >
                                Cancelar
                            </button>
                            <button className="confirm-button" onClick={handleConfirmPickup}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <NotificationToast
                toasts={toasts}
                onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
            />
            <AddCartModal
                isOpen={showAddCartModal}
                onClose={() => setShowAddCartModal(false)}
                onAddCart={handleConfirmAddCart}
            />
        </div>
    );
};

export default App;
