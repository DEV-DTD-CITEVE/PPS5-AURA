import { useState } from "react";
import "./addCartModal.css";

const AddCartModal = ({ isOpen, onClose, onAddCart }) => {
  const [errorModal, setErrorModal] = useState("");
  const [cartTitle, setCartTitle] = useState("");
  const [compartments, setCompartments] = useState([
  { name: "A", variant: "", limit: 20 },
  { name: "B", variant: "", limit: 20 },
  { name: "C", variant: "", limit: 20 },
]);


 const handleAddCart = () => {
  // validar nome do carrinho
  if (!cartTitle.trim()) {
    setErrorModal("Por favor, insira um nome para o carrinho antes de continuar.");
    return;
  }

  // validar variantes dos compartimentos
  const hasEmptyVariant = compartments.some(
    (c) => !c.variant || !c.variant.trim()
  );

  if (hasEmptyVariant) {
    setErrorModal("Por favor, preencha todos os compartimentos.");
    return;
  }

  const compartmentsObj = {};
  compartments.forEach((c) => {
    compartmentsObj[c.name] = {
      coords: { X: 0, Y: 0, Z: 0, A: 0, B: 0, C: 0 },
      piece_type: c.variant,
      piece_count: 0,
      max_pieces: c.limit,
      area: 10000,
      size: { length: 100, width: 100 }
    };
  });

  const newCart = {
    id: cartTitle,
    status: "available",
    compartments: compartmentsObj
  };

  onAddCart(newCart);

  // reset
  setCartTitle("");
setCompartments([
  { name: "A", variant: "", limit: 20 },
  { name: "B", variant: "", limit: 20 },
  { name: "C", variant: "", limit: 20 },
]);
  onClose();
};

  const handleCompartmentChange = (index, field, value) => {
    setCompartments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const formatCompartmentTitle = (name) => {
    const suffix = name.split("_")[1] || name;
    return `Compartimento ${suffix}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-cart-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="add-cart-title">Adicionar Novo Carrinho</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {errorModal && (
  <div className="confirm-modal-backdrop" onClick={() => setErrorModal("")}>
    <div
      className="confirm-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h4>Atenção</h4>
      <p>{errorModal}</p>
      <div className="confirm-modal-actions">
        <button
          className="confirm-button"
          onClick={() => setErrorModal("")}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

        <div className="modal-body">
          <div className="form-group">
            <label>Nome do Carrinho</label>
            <input
              type="text"
              value={cartTitle}
              onChange={(e) => setCartTitle(e.target.value)}
              placeholder="Ex: Carrinho 1250A7"
              className="form-input"
            />
          </div>

          <div className="compartments-section">
            <div className="compartments-list">
              {compartments.map((comp, idx) => (
                <div key={comp.name} className="compartment-config">
                  <div className="compartment-title">
                    {formatCompartmentTitle(comp.name)}
                  </div>

                  <div className="compartment-inputs">
                    <div className="form-group">
                      <label>Variante</label>
                      <input
                        type="text"
                        value={comp.variant}
                        onChange={(e) =>
                          handleCompartmentChange(idx, "variant", e.target.value)
                        }
                        placeholder="Ex: Tshirt_Back"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Limite</label>
                      <input
                        type="number"
                        value={comp.limit}
                        onChange={(e) =>
                          handleCompartmentChange(
                            idx,
                            "limit",
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        className="form-input"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-btn-confirm" onClick={handleAddCart}>
            Criar Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCartModal;