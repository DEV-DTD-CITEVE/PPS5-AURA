import { useState } from "react";
import "./sidebar.css";

const NAV_ITEMS = [
  {
    key: "Gestão de Carrinhos",
    label: "Gestão de Carrinhos",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M1 1h2.5l1.8 8.5h8.4l1.3-5.5H5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx="8" cy="14.5" r="1.2" fill="currentColor"/>
  <circle cx="12.5" cy="14.5" r="1.2" fill="currentColor"/>
</svg>
    ),
  },
  {
    key: "Costura",
    label: "Costura",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M13 2L5 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  <path d="M11.5 2.5c0 0 2 0.5 2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  <path d="M5 16c-1.5 0-2.5-0.5-2.5-1.5S3.5 13 5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  <path d="M7 7c1.5-0.5 3 0.5 2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.2 1.5"/>
</svg>
    ),
  },
];


const Sidebar = ({ currentPage, onNavigate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`sidebar ${expanded ? "sidebar--expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`sidebar-item ${currentPage === item.key ? "sidebar-item--active" : ""}`}
            onClick={() => onNavigate(item.key)}
            title={!expanded ? item.label : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />

    </aside>
  );
};

export default Sidebar;