const Field = ({ field, value, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "codeCommune") {
      if (value === "" || /^\d{0,3}$/.test(value)) {
        onChange(e);
      }
      return;
    }

    if (name === "iban") {
      if (value === "" || /^[A-Z0-9]{0,34}$/.test(value.toUpperCase())) {
        e.target.value = value.toUpperCase();
        onChange(e);
      }
      return;
    }

    if (name === "bic") {
      if (value === "" || /^[A-Z0-9]{0,11}$/.test(value.toUpperCase())) {
        e.target.value = value.toUpperCase();
        onChange(e);
      }
      return;
    }

    onChange(e);
  };

  const common = {
    name: field.name,
    className: "form-control form-control-sm",
    value: value || "",
    onChange: handleChange,
    placeholder: field.placeholder || "",
  };

  if (field.type === "email") {
    return (
      <input
        type="email"
        {...common}
        pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}"
        title="Veuillez entrer une adresse email valide"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        {...common}
        className="form-select form-select-sm"
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre",
        }}
      >
        <option value=""></option>
        {(field.options || []).map((opt) => {
          if (opt.key && opt.libelle) {
            const keyStr = String(opt.key);
            const labelStr = String(opt.libelle);
            const totalChars = 10;
            const paddedKey = keyStr.padEnd(totalChars, "\u00A0");
            return (
              <option key={opt.key} value={opt.key}>
                {paddedKey + labelStr}
              </option>
            );
          }
          if (opt.key && opt.label) {
            const keyStr = String(opt.key);
            const labelStr = String(opt.label);
            const totalChars = 10;
            const paddedKey = keyStr.padEnd(totalChars, "\u00A0");
            return (
              <option key={opt.key} value={opt.key}>
                {paddedKey + labelStr}
              </option>
            );
          }
          if (opt.codePays && opt.nomPays) {
            return (
              <option key={opt.codePays} value={opt.codePays}>
              {opt.nomPays} - {opt.codePays}
              </option>
            );
          }
          if (opt.code && opt.nom) {
            return (
              <option key={opt.code} value={opt.code}>
                {opt.nom} - {opt.code}
              </option>
            );
          }
          if (opt.code && opt.name) {
            return (
              <option key={opt.code} value={opt.code}>
                {opt.name} - {opt.code}
              </option>
            );
          }
          return (
            <option key={opt} value={opt}>
              {opt}
            </option>
          );
        })}
      </select>
    );
  }

  return <input type={field.type || "text"} {...common} />;
};

export default Field;
