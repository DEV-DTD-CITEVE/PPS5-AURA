import "./footer.css";

const Footer = () => {
  return (
    <div className="footer-desktop">
      <div className="footer-left-desktop">
        <div className="footer-item-desktop-logo">
          <img
            src={`${process.env.PUBLIC_URL}/images/citeve.svg`}
            alt="Citeve"
            className="footer-item-desktop-logo-citeve"
          />
        </div>
      </div>
      <div className="footer-center-desktop">

      </div>
      <div className="footer-right-desktop">
        <div className={`footer-item-desktop-search`}></div>
        <div className="footer-item-desktop-logo">
          <img
            src={`${process.env.PUBLIC_URL}/images/textpact.svg`}
            alt="Ícone de pesquisa"
            className="footer-item-desktop-logo-textpact"
          />
        </div>
        <div className="footer-item-desktop-logo">
          <img
            src={`${process.env.PUBLIC_URL}/images/prr.svg`}
            alt="Ícone de pesquisa"
            className="footer-item-desktop-logo-prr"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
