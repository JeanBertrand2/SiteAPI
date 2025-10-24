const Field = ({ field, value, onChange }) => {
  const common = {
    name: field.name,
    className: "form-control form-control-sm",
    value: value || "",
    onChange,
    readOnly: !!field.readOnly,
    placeholder: field.placeholder || "",
  };

  if (field.type === "select") {
    return (
      <select
        {...common}
        className="form-select form-select-sm"
        style={{ fontFamily: "monospace", whiteSpace: "pre" }}
      >
        <option value="">Sélectionnez</option>
        {(field.options || []).map((opt) => {
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
