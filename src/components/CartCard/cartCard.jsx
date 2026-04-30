import React, { useState, useEffect } from "react";
import "./cartCard.css";
import Compartment from "../compartmentDetails.jsx/compartment.jsx";
import CardGraph from "../cardGraph/cardGraph.jsx";

const CartCard = ({
  title,
  itemsCount,
  compartments,
  onUpdate,
  onDelete,
  onPickup,
  initialEditing = false,
  isCollapsed,
  onToggleCollapse,
  pickupModal = false
}) => {
  const comps = Array.isArray(compartments) ? compartments : [];
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [editedCompartments, setEditedCompartments] = useState(
    initialEditing ? JSON.parse(JSON.stringify(compartments || [])) : []
  );

  // Modal de carrinho cheio (local ao card)
  const [showFullModal, setShowFullModal] = useState(false);

  // Percentagens
  const findPctByKeyFromList = (list, key) => {
    const target = `compartment_${key}`.toLowerCase();
    let found = list.find((c) => (c.name || "").toLowerCase() === target);
    if (!found)
      found = list.find((c) =>
        (c.name || "").toLowerCase().includes(key.toLowerCase())
      );
    const pct =
      found && found.max_pieces > 0
        ? (found.piece_count / found.max_pieces) * 100
        : 0;

    return Number(pct.toFixed(2));
  };

  const activeComps = isEditing ? editedCompartments : comps;

  const graphData = {
    A: findPctByKeyFromList(activeComps, "A"),
    B: findPctByKeyFromList(activeComps, "B"),
    C: findPctByKeyFromList(activeComps, "C")
  };

  // Total items
  const totalItems = comps.reduce((sum, c) => sum + (c.piece_count || 0), 0);
  const itemsCountFinal =
    typeof itemsCount === "number" ? itemsCount : totalItems;

  // Carrinho cheio
  const isFull =
    comps.length > 0 &&
    comps.every(
      (c) =>
        c.max_pieces > 0 &&
        (c.piece_count / c.max_pieces) * 100 >= 100
    );

  // Abre modal automaticamente (mas NÃO dentro da modal geral)
  useEffect(() => {
    if (isFull && !pickupModal) {
      setShowFullModal(true);
    }
  }, [isFull, pickupModal]);

  // Status dot
  const getStatusClass = () => {
    if (isFull) return "status-error";
    if (itemsCountFinal === 0) return "status-inactive";
    return "status-active";
  };

  const handlePickupClick = (e) => {
    e.stopPropagation();
    if (onPickup) onPickup();
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (onUpdate) onUpdate(title, editedCompartments);
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditedCompartments([]);
    onToggleCollapse && onToggleCollapse(false);
  };

  const handleCompartmentChange = (index, field, value) => {
    const updated = [...editedCompartments];
    const comp = updated[index];

    let newValue = value;

    if (field === "piece_count") {
      const max = comp.max_pieces || 0;

      newValue = parseInt(value, 10);
      if (isNaN(newValue)) newValue = 0;

      if (newValue < 0) newValue = 0;
      if (newValue > max) newValue = max;
    }

    updated[index] = { ...comp, [field]: newValue };
    setEditedCompartments(updated);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <article
      className={`cart-card ${isCollapsed ? "collapsed" : ""}`}
      onClick={() =>
        !isEditing && onToggleCollapse && onToggleCollapse(!isCollapsed)
      }
      style={{ position: "relative" }} 
    >
      <header className="cart-card-header">
        <div className="cart-card-header-left">
          <div
            className="title-status-wrapper"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <h4 className="cart-card-title">{title}</h4>
            <span
              className={`status-dot ${getStatusClass()}`}
              title="Status do carrinho"
            />
          </div>
          <div className="cart-card-badge">{itemsCountFinal} items</div>
        </div>

        <div className="cart-card-header-right">
          {!isEditing ? (
            <>
              <button
                className="handleCartPickup-button"
                onClick={handlePickupClick}
                title="Recolher carrinho"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.6 12h13" />
                  <path d="M13 5h7" />
                  <path d="M17 1l4 4-4 4" />
                </svg>
              </button>

              <button
                className="delete-icon-button"
                onClick={handleDeleteClick}
                title="Eliminar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 6h18v2H3V6zm2 4h14l-1.5 12.5a1 1 0 0 1-1 .5H8a1 1 0 0 1-1-.5L5 10zm5-6h4v2h-4V4z" />
                </svg>
              </button>
            </>
          ) : (
            <div className="edit-actions">
              <button className="save-button" onClick={handleSave} title="Salvar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="cancel-button"
                onClick={handleCancel}
                title="Cancelar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="cart-card-content">
        <div className="card-visual">
          <CardGraph
            data={graphData}
            images={{
              A: compartments[0]?.piece_image,
              B: compartments[1]?.piece_image,
              C: compartments[2]?.piece_image
            }}
          />
        </div>

        <div className="card-compartment">
          <Compartment
            compartments={isEditing ? editedCompartments : comps}
            isEditing={isEditing}
            onCompartmentChange={handleCompartmentChange}
          />
        </div>
      </div>

      {/* MODAL LOCAL (apenas dentro do card) */}
      {showFullModal && !pickupModal && (
        <div
          className="cart-full-overlay local"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className="cart-full-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>O carrinho está cheio</h3>
            <p>Deseja que seja retirado?</p>

            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() => setShowFullModal(false)}
              >
                Cancelar
              </button>

              <button className="primary" onClick={handlePickupClick}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default CartCard;