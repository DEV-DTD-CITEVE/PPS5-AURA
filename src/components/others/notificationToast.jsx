import "./notificationToast.css";

const ICON_SIZE = 18;

const Icon = ({ variant }) => {
  switch (variant) {
    case "success":
      return <span style={{ fontSize: ICON_SIZE }}>✅</span>;
    case "warning":
      return <span style={{ fontSize: ICON_SIZE }}>⚠️</span>;
    case "error":
      return <span style={{ fontSize: ICON_SIZE }}>⛔</span>;
    case "neutralBlue":
      return <span style={{ fontSize: ICON_SIZE }}>🔔</span>;
    default:
      return <span style={{ fontSize: ICON_SIZE }}>ℹ️</span>;
  }
};

function ToastItem({ t, onRemove }) {
  const isAssertive = t.variant === "error" || t.variant === "warning";
  return (
    <div
      className={`toast ${t.variant}`}
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
    >
      <div className="toast-left">
        <div className="toast-icon-wrap">
          <Icon variant={t.variant} />
        </div>
        <div className="toast-texts">
          {t.title ? <div className="toast-title">{t.title}</div> : null}
          {t.message ? <div className="toast-message">{t.message}</div> : null}
        </div>
      </div>
      <button
        className="toast-close"
        onClick={() => onRemove(t.id)}
        aria-label="Fechar notificação"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

const NotificationToast = ({ toasts = [], onRemove }) => {
  const topToasts = toasts.filter(t => t.position === "top");
  const bottomToasts = toasts.filter(t => t.position !== "top");


  return (
    <>
      <div className="toast-viewport top-center">
        {topToasts.map(t => <ToastItem key={t.id} t={t} onRemove={onRemove} />)}
      </div>

      <div className="toast-viewport bottom-right">
        {bottomToasts.map(t => <ToastItem key={t.id} t={t} onRemove={onRemove} />)}
      </div>
    </>
  );
};

export default NotificationToast;
