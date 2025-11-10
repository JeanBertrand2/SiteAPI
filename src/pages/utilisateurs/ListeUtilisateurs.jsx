const ListeUtilisateurs = () => {
  const users = [
    { id: 1, email: "jean.dupont@example.com", nom: "Dupont", prenom: "Jean" },
    {
      id: 2,
      email: "marie.durand@example.com",
      nom: "Durand",
      prenom: "Marie",
    },
    { id: 3, email: "paul.martin@example.com", nom: "Martin", prenom: "Paul" },
  ];

  return (
    <div
      className="container my-4"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",    
      }}
    >
      <h2 className="card-title mb-3">Liste des utilisateurs</h2>
      <div
        className="card shadow-sm"
        style={{ width: "900px", maxWidth: "95%" }}
      >
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className="badge bg-primary">{u.id}</span>
                    </td>
                    <td className="text-break">{u.email}</td>
                    <td>{u.nom}</td>
                    <td>{u.prenom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeUtilisateurs;
