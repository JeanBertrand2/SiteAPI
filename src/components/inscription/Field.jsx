const Field = ({ field, value, onChange, isFromJson }) => {
  const common = {
    name: field.name,
    className: "form-control form-control-sm",
    value: value || "",
    onChange,
    placeholder: field.placeholder || "",
  };

  const shouldBeReadOnly = field.readOnly === true || isFromJson;

  if (field.type === "select") {
    return (
      <select
        {...common}
        className="form-select form-select-sm"
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre",
          ...(shouldBeReadOnly ? { pointerEvents: "none" } : {}),
        }}
        disabled={shouldBeReadOnly}
        tabIndex={shouldBeReadOnly ? -1 : 0}
        onFocus={(e) => shouldBeReadOnly && e.target.blur()}
      >
        <option value="">Sélectionnez</option>
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

  return (
    <input
      type={field.type || "text"}
      {...common}
      readOnly={shouldBeReadOnly}
      tabIndex={shouldBeReadOnly ? -1 : 0}
      style={shouldBeReadOnly ? { pointerEvents: "none" } : {}}
      onFocus={(e) => shouldBeReadOnly && e.target.blur()}
    />
  );
};

export default Field;
