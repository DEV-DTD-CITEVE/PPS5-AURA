import "./header.css";

const Header = ({ onClick }) => {
  return (
    <div className="navbar-desktop" onClick={onClick}>
      <div className="navbar-left-desktop">
        <div className="navbar-icon">
          <img
            src="/images/teste.svg"
            alt="Automated Unit Robotic Assembly"
            className="navbar-icon-search-desktop"
          />
        </div>
      </div>
      <div className="navbar-right-desktop" />
    </div>
  );
};

export default Header;