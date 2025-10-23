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
      <select {...common} className="form-select form-select-sm">
        <option value=""></option>
        {(field.options || []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return <input type={field.type || "text"} {...common} />;
};

export default Field;
