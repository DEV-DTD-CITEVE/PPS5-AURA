import { useState, useEffect } from "react";
import "./insertInput.css";

const InsertInput = ({
  titulo_input,
  placeholder_input,
  value,
  setValue,
  numbersOnly = false,
}) => {
  const [valueCurrent, setValueCurrent] = useState(value || "");

  useEffect(() => {
    if (value !== undefined && value !== valueCurrent) {
      setValueCurrent(value);
    }
  }, [value, valueCurrent]);

  const sanitizeValue = (v) => {
    if (!numbersOnly) return v;
    return String(v).replace(/\D+/g, "");
  };

  const handleInputChange = (event) => {
    const raw = event.target.value;
    const newValue = sanitizeValue(raw);
    setValueCurrent(newValue);
    if (setValue) setValue(newValue);
  };

  return (
    <div className="input-with-units-full-component-others">
      <div className="input-with-units-header">
        <p className="input-with-units-titulo-others">{titulo_input}</p>
      </div>
      <div className="input-with-units-component-others">
        <input
          className="input-with-units-value-others"
          placeholder={placeholder_input}
          onChange={handleInputChange}
          value={valueCurrent}
          required
        />
      </div>
    </div>
  );
};

export default InsertInput;