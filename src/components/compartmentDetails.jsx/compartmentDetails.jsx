import "./compartmentDetails.css";

const CompartmentDetails = ({
  name,
  piece_type,
  piece_count,
  max_pieces,
  isEditing = false,
  onItemsChange = () => {},
}) => {
  const percentage = max_pieces > 0 ? (piece_count / max_pieces) * 100 : 0;
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  
  const colorClass = pct === 100 ? "fill-red" : pct >= 50 ? "fill-yellow" : "fill-green";

  return (
    <div className="compartment-card" aria-label={`Details for ${name}`}>
      <div className="compartment-header">
        <div className="compartment-name">{name}</div>
        <div className="compartment-badges">
          {isEditing ? (
            <div className="items-editor">
              <button
                className="items-btn decrement"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemsChange(Math.max(0, piece_count - 1));
                }}
                title="Diminuir"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <input
                type="number"
                className="items-input"
                value={piece_count}
                onChange={(e) => onItemsChange(parseInt(e.target.value) || 0)}
                onClick={(e) => e.stopPropagation()}
                min="0"
              />
              <button
                className="items-btn increment"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemsChange(piece_count + 1);
                }}
                title="Aumentar"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ) : (
            <span className="badge items">{piece_count} items</span>
          )}
        </div>
      </div>
      <span className="badge variant">{piece_type}</span>
      <div className="compartment-progress">
        <div
          className="progress-bar-background"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={`${pct}% full`}
        >
          <div
            className={`progress-bar-fill ${colorClass}`}
            style={{ width: `${pct}%`, borderRadius: 99 }}
          />
        </div>
        <div className="progress-percentage">{pct}%</div>
      </div>
    </div>
  );
};

export default CompartmentDetails;