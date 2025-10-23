const Row = ({ cols }) => (
  <div className="row mb-2">
    {cols.map((c, i) => (
      <div className={c.col || "col-12"} key={i}>
        {c.label && <label className="form-label field-label">{c.label}</label>}
        {c.element}
      </div>
    ))}
  </div>
);

export default Row;