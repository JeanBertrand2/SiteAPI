import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Field from "../../components/inscription/Field";
import "./InscriptClient.css";
const typesVoie = [
  { key: "ALL", label: "Allée" },
  { key: "AVE", label: "Avenue" },
  { key: "BLVD", label: "Boulevard" },
  { key: "CHE", label: "Chemin" },
  { key: "CIT", label: "Cité" },
  { key: "CLOS", label: "Clos" },
  { key: "COR", label: "Corniche" },
  { key: "COURS", label: "Cours" },
  { key: "DOM", label: "Domaine" },
  { key: "ESP", label: "Esplanade" },
  { key: "IMP", label: "Impasse" },
  { key: "JARD", label: "Jardin" },
  { key: "LOT", label: "Lotissement" },
  { key: "PASS", label: "Passage" },
  { key: "PLC", label: "Place" },
  { key: "PLN", label: "Plaine" },
  { key: "PONT", label: "Pont" },
  { key: "PORT", label: "Port" },
  { key: "QUAI", label: "Quai" },
  { key: "RUEL", label: "Ruelle" },
  { key: "ROUTE", label: "Route" },
  { key: "RUE", label: "Rue" },
  { key: "SQ", label: "Square" },
  { key: "TERR", label: "Terrasse" },
  { key: "TRAV", label: "Traverse" },
  { key: "VILLA", label: "Villa" },
  { key: "VOIE", label: "Voie" },
  { key: "ZONE", label: "Zone" },
];
const COUNTRIES_COG = [
  { name: "Afghanistan", code: "99101" },
  { name: "Albania", code: "99102" },
  { name: "Algeria", code: "99103" },
  { name: "Andorra", code: "99104" },
  { name: "Angola", code: "99105" },
  { name: "Antigua and Barbuda", code: "99106" },
  { name: "Argentina", code: "99107" },
  { name: "Armenia", code: "99108" },
  { name: "Australia", code: "99109" },
  { name: "Austria", code: "99110" },
  { name: "Azerbaijan", code: "99111" },
  { name: "Bahamas", code: "99112" },
  { name: "Bahrain", code: "99113" },
  { name: "Bangladesh", code: "99114" },
  { name: "Barbados", code: "99115" },
  { name: "Belarus", code: "99116" },
  { name: "Belgium", code: "99117" },
  { name: "Belize", code: "99118" },
  { name: "Benin", code: "99119" },
  { name: "Bhutan", code: "99120" },
  { name: "Bolivia", code: "99121" },
  { name: "Bosnia and Herzegovina", code: "99122" },
  { name: "Botswana", code: "99123" },
  { name: "Brazil", code: "99124" },
  { name: "Brunei Darussalam", code: "99125" },
  { name: "Bulgaria", code: "99126" },
  { name: "Burkina Faso", code: "99127" },
  { name: "Burundi", code: "99128" },
  { name: "Cabo Verde", code: "99129" },
  { name: "Cambodia", code: "99130" },
  { name: "Cameroon", code: "99131" },
  { name: "Canada", code: "99132" },
  { name: "Central African Republic", code: "99133" },
  { name: "Chad", code: "99134" },
  { name: "Chile", code: "99135" },
  { name: "China", code: "99136" },
  { name: "Colombia", code: "99137" },
  { name: "Comoros", code: "99138" },
  { name: "Congo (Congo-Brazzaville)", code: "99139" },
  { name: "Costa Rica", code: "99140" },
  { name: "Croatia", code: "99141" },
  { name: "Cuba", code: "99142" },
  { name: "Cyprus", code: "99143" },
  { name: "Czech Republic", code: "99144" },
  { name: "Democratic People's Republic of Korea", code: "99145" },
  { name: "Democratic Republic of the Congo", code: "99146" },
  { name: "Denmark", code: "99147" },
  { name: "Djibouti", code: "99148" },
  { name: "Dominica", code: "99149" },
  { name: "Dominican Republic", code: "99150" },
  { name: "Ecuador", code: "99151" },
  { name: "Egypt", code: "99152" },
  { name: "El Salvador", code: "99153" },
  { name: "Equatorial Guinea", code: "99154" },
  { name: "Eritrea", code: "99155" },
  { name: "Estonia", code: "99156" },
  { name: "Eswatini", code: "99157" },
  { name: "Ethiopia", code: "99158" },
  { name: "Fiji", code: "99159" },
  { name: "Finland", code: "99160" },
  { name: "France", code: "99100" },
  { name: "Gabon", code: "99161" },
  { name: "Gambia", code: "99162" },
  { name: "Georgia", code: "99163" },
  { name: "Germany", code: "99164" },
  { name: "Ghana", code: "99165" },
  { name: "Greece", code: "99166" },
  { name: "Grenada", code: "99167" },
  { name: "Guatemala", code: "99168" },
  { name: "Guinea", code: "99169" },
  { name: "Guinea-Bissau", code: "99170" },
  { name: "Guyana", code: "99171" },
  { name: "Haiti", code: "99172" },
  { name: "Honduras", code: "99173" },
  { name: "Hungary", code: "99174" },
  { name: "Iceland", code: "99175" },
  { name: "India", code: "99176" },
  { name: "Indonesia", code: "99177" },
  { name: "Iran", code: "99178" },
  { name: "Iraq", code: "99179" },
  { name: "Ireland", code: "99180" },
  { name: "Israel", code: "99181" },
  { name: "Italy", code: "99182" },
  { name: "Jamaica", code: "99183" },
  { name: "Japan", code: "99184" },
  { name: "Jordan", code: "99185" },
  { name: "Kazakhstan", code: "99186" },
  { name: "Kenya", code: "99187" },
  { name: "Kiribati", code: "99188" },
  { name: "Korea (Republic of)", code: "99189" },
  { name: "Kuwait", code: "99190" },
  { name: "Kyrgyzstan", code: "99191" },
  { name: "Laos", code: "99192" },
  { name: "Latvia", code: "99193" },
  { name: "Lebanon", code: "99194" },
  { name: "Lesotho", code: "99195" },
  { name: "Liberia", code: "99196" },
  { name: "Libya", code: "99197" },
  { name: "Liechtenstein", code: "99198" },
  { name: "Lithuania", code: "99199" },
  { name: "Luxembourg", code: "99200" },
  { name: "Madagascar", code: "99201" },
  { name: "Malawi", code: "99202" },
  { name: "Malaysia", code: "99203" },
  { name: "Maldives", code: "99204" },
  { name: "Mali", code: "99205" },
  { name: "Malta", code: "99206" },
  { name: "Marshall Islands", code: "99207" },
  { name: "Mauritania", code: "99208" },
  { name: "Mauritius", code: "99209" },
  { name: "Mexico", code: "99210" },
  { name: "Micronesia (Federated States of)", code: "99211" },
  { name: "Moldova", code: "99212" },
  { name: "Monaco", code: "99213" },
  { name: "Mongolia", code: "99214" },
  { name: "Montenegro", code: "99215" },
  { name: "Morocco", code: "99216" },
  { name: "Mozambique", code: "99217" },
  { name: "Myanmar", code: "99218" },
  { name: "Namibia", code: "99219" },
  { name: "Nauru", code: "99220" },
  { name: "Nepal", code: "99221" },
  { name: "Netherlands", code: "99222" },
  { name: "New Zealand", code: "99223" },
  { name: "Nicaragua", code: "99224" },
  { name: "Niger", code: "99225" },
  { name: "Nigeria", code: "99226" },
  { name: "North Macedonia", code: "99227" },
  { name: "Norway", code: "99228" },
  { name: "Oman", code: "99229" },
  { name: "Pakistan", code: "99230" },
  { name: "Palau", code: "99231" },
  { name: "Panama", code: "99232" },
  { name: "Papua New Guinea", code: "99233" },
  { name: "Paraguay", code: "99234" },
  { name: "Peru", code: "99235" },
  { name: "Philippines", code: "99236" },
  { name: "Poland", code: "99237" },
  { name: "Portugal", code: "99238" },
  { name: "Qatar", code: "99239" },
  { name: "Romania", code: "99240" },
  { name: "Russia", code: "99241" },
  { name: "Rwanda", code: "99242" },
  { name: "Saint Kitts and Nevis", code: "99243" },
  { name: "Saint Lucia", code: "99244" },
  { name: "Saint Vincent and the Grenadines", code: "99245" },
  { name: "Samoa", code: "99246" },
  { name: "San Marino", code: "99247" },
  { name: "Sao Tome and Principe", code: "99248" },
  { name: "Saudi Arabia", code: "99249" },
  { name: "Senegal", code: "99250" },
  { name: "Serbia", code: "99251" },
  { name: "Seychelles", code: "99252" },
  { name: "Sierra Leone", code: "99253" },
  { name: "Singapore", code: "99254" },
  { name: "Slovakia", code: "99255" },
  { name: "Slovenia", code: "99256" },
  { name: "Solomon Islands", code: "99257" },
  { name: "Somalia", code: "99258" },
  { name: "South Africa", code: "99259" },
  { name: "South Sudan", code: "99260" },
  { name: "Spain", code: "99261" },
  { name: "Sri Lanka", code: "99262" },
  { name: "Sudan", code: "99263" },
  { name: "Suriname", code: "99264" },
  { name: "Sweden", code: "99265" },
  { name: "Switzerland", code: "99266" },
  { name: "Syria", code: "99267" },
  { name: "Taiwan", code: "99268" },
  { name: "Tajikistan", code: "99269" },
  { name: "Tanzania", code: "99270" },
  { name: "Thailand", code: "99271" },
  { name: "Timor-Leste", code: "99272" },
  { name: "Togo", code: "99273" },
  { name: "Tonga", code: "99274" },
  { name: "Trinidad and Tobago", code: "99275" },
  { name: "Tunisia", code: "99276" },
  { name: "Turkey", code: "99277" },
  { name: "Turkmenistan", code: "99278" },
  { name: "Tuvalu", code: "99279" },
  { name: "Uganda", code: "99280" },
  { name: "Ukraine", code: "99281" },
  { name: "United Arab Emirates", code: "99282" },
  { name: "United Kingdom", code: "99283" },
  { name: "United States", code: "99284" },
  { name: "Uruguay", code: "99285" },
  { name: "Uzbekistan", code: "99286" },
  { name: "Vanuatu", code: "99287" },
  { name: "Vatican City", code: "99288" },
  { name: "Venezuela", code: "99289" },
  { name: "Vietnam", code: "99290" },
  { name: "Yemen", code: "99291" },
  { name: "Zambia", code: "99292" },
  { name: "Zimbabwe", code: "99293" },
];
const departementCode = [
  { code: "001", name: "Ain" },
  { code: "002", name: "Aisne" },
  { code: "003", name: "Allier" },
  { code: "004", name: "Alpes-de-Haute-Provence" },
  { code: "005", name: "Hautes-Alpes" },
  { code: "006", name: "Alpes-Maritimes" },
  { code: "007", name: "Ardèche" },
  { code: "008", name: "Ardennes" },
  { code: "009", name: "Ariège" },
  { code: "010", name: "Aube" },
  { code: "011", name: "Aude" },
  { code: "012", name: "Aveyron" },
  { code: "013", name: "Bouches-du-Rhône" },
  { code: "014", name: "Calvados" },
  { code: "015", name: "Cantal" },
  { code: "016", name: "Charente" },
  { code: "017", name: "Charente-Maritime" },
  { code: "018", name: "Cher" },
  { code: "019", name: "Corrèze" },
  { code: "02A", name: "Corse-du-Sud" },
  { code: "02B", name: "Haute-Corse" },
  { code: "021", name: "Côte-d'Or" },
  { code: "022", name: "Côtes-d'Armor" },
  { code: "023", name: "Creuse" },
  { code: "024", name: "Dordogne" },
  { code: "025", name: "Doubs" },
  { code: "026", name: "Drôme" },
  { code: "027", name: "Eure" },
  { code: "028", name: "Eure-et-Loir" },
  { code: "029", name: "Finistère" },
  { code: "030", name: "Gard" },
  { code: "031", name: "Haute-Garonne" },
  { code: "032", name: "Gers" },
  { code: "033", name: "Gironde" },
  { code: "034", name: "Hérault" },
  { code: "035", name: "Ille-et-Vilaine" },
  { code: "036", name: "Indre" },
  { code: "037", name: "Indre-et-Loire" },
  { code: "038", name: "Isère" },
  { code: "039", name: "Jura" },
  { code: "040", name: "Landes" },
  { code: "041", name: "Loir-et-Cher" },
  { code: "042", name: "Loire" },
  { code: "043", name: "Haute-Loire" },
  { code: "044", name: "Loire-Atlantique" },
  { code: "045", name: "Loiret" },
  { code: "046", name: "Lot" },
  { code: "047", name: "Lot-et-Garonne" },
  { code: "048", name: "Lozère" },
  { code: "049", name: "Maine-et-Loire" },
  { code: "050", name: "Manche" },
  { code: "051", name: "Marne" },
  { code: "052", name: "Haute-Marne" },
  { code: "053", name: "Mayenne" },
  { code: "054", name: "Meurthe-et-Moselle" },
  { code: "055", name: "Meuse" },
  { code: "056", name: "Morbihan" },
  { code: "057", name: "Moselle" },
  { code: "058", name: "Nièvre" },
  { code: "059", name: "Nord" },
  { code: "060", name: "Oise" },
  { code: "061", name: "Orne" },
  { code: "062", name: "Pas-de-Calais" },
  { code: "063", name: "Puy-de-Dôme" },
  { code: "064", name: "Pyrénées-Atlantiques" },
  { code: "065", name: "Hautes-Pyrénées" },
  { code: "066", name: "Pyrénées-Orientales" },
  { code: "067", name: "Bas-Rhin" },
  { code: "068", name: "Haut-Rhin" },
  { code: "069", name: "Rhône" },
  { code: "070", name: "Haute-Saône" },
  { code: "071", name: "Saône-et-Loire" },
  { code: "072", name: "Sarthe" },
  { code: "073", name: "Savoie" },
  { code: "074", name: "Haute-Savoie" },
  { code: "075", name: "Paris" },
  { code: "076", name: "Seine-Maritime" },
  { code: "077", name: "Seine-et-Marne" },
  { code: "078", name: "Yvelines" },
  { code: "079", name: "Deux-Sèvres" },
  { code: "080", name: "Somme" },
  { code: "081", name: "Tarn" },
  { code: "082", name: "Tarn-et-Garonne" },
  { code: "083", name: "Var" },
  { code: "084", name: "Vaucluse" },
  { code: "085", name: "Vendée" },
  { code: "086", name: "Vienne" },
  { code: "087", name: "Haute-Vienne" },
  { code: "088", name: "Vosges" },
  { code: "089", name: "Yonne" },
  { code: "090", name: "Territoire de Belfort" },
  { code: "091", name: "Essonne" },
  { code: "092", name: "Hauts-de-Seine" },
  { code: "093", name: "Seine-Saint-Denis" },
  { code: "094", name: "Val-de-Marne" },
  { code: "095", name: "Val-d'Oise" },
  { code: "971", name: "Guadeloupe" },
  { code: "972", name: "Martinique" },
  { code: "973", name: "Guyane" },
  { code: "974", name: "La Réunion" },
  { code: "976", name: "Mayotte" },
];

const InscriptClient = () => {
  const initial = {
    fichierJson: "",
    civilite: "",
    nomNaissance: "",
    nomUsage: "",
    prenoms: "",
    dateNaissance: "",
    nomPays: "",
    codePays: "",
    departement: "",
    commune: "",
    codeCommune: "",
    nomCommune: "",
    numTelPortable: "",
    adresseMail: "",
    numeroVoie: "",
    lettreVoie: "",
    codeTypeVoie: "",
    libelleVoie: "",
    complement: "",
    lieuDit: "",
    nomCommune2: "",
    codeInsee: "",
    codePostal: "",
    nomPays2: "FRANCE",

    codePays2: "99100",
    bic: "",
    iban: "",
    titulaire: "",
    idParticulier: "",
  };
  const lettresVoie = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const [formData, setFormData] = useState(initial);
  const [selectedFile, setSelectedFile] = useState("");
  const [countries, setCountries] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nomPays" || name === "nomPays2") {
      const selectedCountry = COUNTRIES_COG.find(
        (c) => `${c.name} - ${c.code}` === value
      );

      if (name === "nomPays") {
        setFormData((p) => ({
          ...p,
          nomPays: selectedCountry?.name || "",
          codePays: selectedCountry?.code || "",
        }));
      } else {
        setFormData((p) => ({
          ...p,
          nomPays2: selectedCountry?.name || "",
          codePays2: selectedCountry?.code || "",
        }));
      }
      return;
    }
    if (name === "departement") {
      const selectedDep = departementCode.find(
        (d) => `${d.name} - ${d.code}` === value
      );
      setFormData((p) => ({
        ...p,
        departement: selectedDep
          ? `${selectedDep.name} - ${selectedDep.code}`
          : "",
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileImport = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);

          const mapCivilite = (value) => {
            if (value === "1" || value === "M") return "M";
            if (value === "2" || value === "MME") return "MME";
            return "";
          };

          const mappedData = {
            fichierJson: f.name,
            civilite: mapCivilite(jsonData.civilite),
            nomNaissance: jsonData.nomNaissance || "",
            nomUsage: jsonData.nomUsage || "",
            prenoms: jsonData.prenoms || "",
            dateNaissance: jsonData.dateNaissance
              ? jsonData.dateNaissance.split("T")[0]
              : "",

            // Lieu naissance
            nomPays:
              COUNTRIES_COG.find(
                (c) => c.code === jsonData.lieuNaissance?.codePaysNaissance
              )?.name || "",
            codePays: jsonData.lieuNaissance?.codePaysNaissance || "",
            departement: (() => {
              const dep = departementCode.find(
                (d) => d.code === jsonData.lieuNaissance?.departementNaissance
              );
              return dep ? `${dep.name} - ${dep.code}` : "";
            })(),
            commune:
              jsonData.lieuNaissance?.communeNaissance?.libelleCommune || "",
            codeCommune:
              jsonData.lieuNaissance?.communeNaissance?.codeCommune || "",
            nomCommune:
              jsonData.lieuNaissance?.communeNaissance?.libelleCommune || "",

            numTelPortable: jsonData.numeroTelephonePortable || "",
            adresseMail: jsonData.adresseMail || "",

            numeroVoie: jsonData.adressePostale?.numeroVoie || "",
            lettreVoie: jsonData.adressePostale?.lettreVoie || "",
            codeTypeVoie: jsonData.adressePostale?.codeTypeVoie || "",
            libelleVoie: jsonData.adressePostale?.libelleVoie || "",
            complement: jsonData.adressePostale?.complement || "",
            lieuDit: jsonData.adressePostale?.lieuDit || "",
            nomCommune2: jsonData.adressePostale?.libelleCommune || "",
            codeInsee: jsonData.adressePostale?.codeCommune || "",
            codePostal: jsonData.adressePostale?.codePostal || "",
            nomPays2:
              COUNTRIES_COG.find(
                (c) => c.code === jsonData.lieuNaissance?.codePaysNaissance
              )?.name || "FRANCE",
            codePays2: jsonData.adressePostale?.codePays || "99100",

            // Coordonnée Bancaire
            bic: jsonData.coordonneeBancaire?.bic || "",
            iban: jsonData.coordonneeBancaire?.iban || "",
            titulaire: jsonData.coordonneeBancaire?.titulaire || "",

            idParticulier: jsonData.idParticulier || "",
          };

          setFormData(mappedData);
          console.log("JSON imported successfully:", mappedData);
        } catch (err) {
          console.error("Error parsing JSON:", err);
          alert(
            "Erreur lors de la lecture du fichier JSON. Veuillez vérifier le format."
          );
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        alert("Erreur lors de la lecture du fichier.");
      };

      reader.readAsText(f);
    }
  };
  const openFile = () => document.getElementById("fileInput").click();
  const submit = () => console.log("Form submitted:", formData);

  const greenFieldNames = [
    "civilite",
    "nomNaissance",
    "prenoms",
    "dateNaissance",
    "nomPays",
    "codePays",
    "codeCommune",
    "nomCommune",
    "numTelPortable",
    "adresseMail",
    "nomCommune2",
    "codeInsee",
    "codePostal",
    "nomPays2",
    "codePays2",
    "bic",
    "iban",
    "titulaire",
  ];

  const leftFields = [
    [
      {
        label: "Civilité",
        name: "civilite",
        type: "select",
        options: ["M", "MME"],
      },
    ],
    [{ label: "Nom Naissance", name: "nomNaissance" }],
    [{ label: "Nom Usage", name: "nomUsage" }],
    [{ label: "Prénoms", name: "prenoms" }],
    [{ label: "Date de naissance", name: "dateNaissance", type: "date" }],
    [
      {
        label: "Nom Pays",
        name: "nomPays",
        type: "select",
        options: COUNTRIES_COG.map((c) => `${c.name} - ${c.code}`),
      },
      {
        label: "Code Pays",
        name: "codePays",
      },
    ],
    [
      {
        label: "Département",
        name: "departement",
        type: "select",
        options: departementCode.map((d) => `${d.name} - ${d.code}`),
      },
    ],
    [{ label: "Commune", name: "commune", readOnly: false }],
    [
      { label: "Code Commune", name: "codeCommune", col: "col-6" },
      { label: "\u00A0", name: "nomCommune", col: "col-6", readOnly: true },
    ],
    [
      {
        label: "Num Tel Portable",
        name: "numTelPortable",
        placeholder: "(Sans espace)",
      },
    ],
    [{ label: "Adresse Mail", name: "adresseMail", type: "email" }],
  ];

  const rightFields = [
    [
      { label: "Numero Voie", name: "numeroVoie", col: "col-6" },

      {
        label: "Lettre Voie",
        name: "lettreVoie",
        col: "col-6",
        type: "select",
        options: lettresVoie,
      },
    ],
    [
      {
        label: "Code Type Voie",
        name: "codeTypeVoie",
        type: "select",
        options: typesVoie,
      },
    ],
    [{ label: "Libelle Voie", name: "libelleVoie" }],
    [{ label: "Complement", name: "complement" }],
    [{ label: "Lieu dit", name: "lieuDit" }],
    [{ label: "Nom Commune", name: "nomCommune2" }],
    [{ label: "Code INSEE", name: "codeInsee" }],
    [{ label: "Code Postal", name: "codePostal" }],
    [
      {
        label: "Nom Pays",
        name: "nomPays2",
        col: "col-6",
        type: "select",
        options: COUNTRIES_COG.map((c) => `${c.name} - ${c.code}`),
      },

      { label: "Code pays", name: "codePays2", col: "col-6" },
    ],
    [{ label: "Bic", name: "bic", placeholder: "(Sans espace)" }],
    [{ label: "IBAN", name: "iban", placeholder: "(Sans espace)" }],
    [{ label: "Titulaire", name: "titulaire" }],
    [{ label: "Id Particulier", name: "idParticulier", readOnly: true }],
  ];

  const renderConfig = (config) =>
    config.map((row, idx) => (
      <div className="mb-3 row align-items-center " key={idx}>
        {row.map((f, fieldIdx) => {
          const labelContent = greenFieldNames.includes(f.name) ? (
            <span style={{ color: "#e05f23ff", fontWeight: "bold" }}>
              {f.label}
            </span>
          ) : (
            f.label
          );

          let fieldValue = formData[f.name];
          if (f.name === "nomPays") {
            fieldValue = `${formData.nomPays || ""}${
              formData.codePays ? " - " + formData.codePays : ""
            }`.trim();
          } else if (f.name === "nomPays2") {
            fieldValue = `${formData.nomPays2 || ""}${
              formData.codePays2 ? " - " + formData.codePays2 : ""
            }`.trim();
          }

          return (
            <div className="row mb-2" key={fieldIdx}>
              <div className="col-4">
                <label
                  className="form-label mb-0"
                  style={{ fontSize: "13px" }}
                  htmlFor={f.name}
                >
                  {labelContent}
                </label>
              </div>
              <div className="col-8">
                <Field
                  field={f}
                  value={fieldValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          );
        })}
      </div>
    ));

  const personalInfoFields = leftFields.slice(0, 5); // Fields before Lieu naissance
  const birthplaceFields = leftFields.slice(5, 7); // Fields for Lieu naissance (Nom pays and Département only)
  const contactFields = leftFields.slice(9); // Fields after Lieu naissance
  const communeFields = leftFields.slice(7, 9); // Fields for Commune (Code commune and nom commune)
  const banqueFields = rightFields.slice(9, 12); // Fields for Coordonnée Bancaire
  const adressePostaleFields = rightFields.slice(0, 9); // Fields for Adresse Postale
  const idParticulierField = rightFields.slice(12); // Field for Id Particulier

  return (
    <div className="inscription-container">
      <div className="card inscription-card">
        <div
          className="card-header d-flex justify-content-center align-items-center inscription-header"
          style={{ padding: "1rem 10px" }}
        >
          <h1 className="header-title">INSCRIPTION PARTICULIER</h1>
        </div>

        <div
          className="card-body inscription-body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="row">
            <div className="col-10 mobile-width">
              <div className="row mb-3">
                <div
                  className="col-md-12"
                  style={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <label className="form-label label-style">Fichier Json</label>

                  <div
                    className="input-group"
                    style={{
                      width: "100%",
                    }}
                  >
                    <input
                      className="form-control form-control-sm"
                      readOnly
                      value={selectedFile || ""}
                    />
                    <input
                      id="fileInput"
                      type="file"
                      accept=".json"
                      style={{ display: "none" }}
                      onChange={handleFileImport}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-sm mb-3"
                    style={{ width: "5%" }}
                    onClick={openFile}
                  >
                    ...
                  </button>
                </div>
              </div>
              <h3
                className="form-label section-title"
                style={{ color: "gray", textDecoration: "underline" }}
              >
                Particulier
              </h3>

              <div style={{ border: "1px solid lightgray ", padding: "10px" }}>
                <div className="row">
                  <div className="col-md-6">
                    {renderConfig(personalInfoFields)}

                    <h3
                      className="form-label section-title"
                      style={{ color: "gray", textDecoration: "underline" }}
                    >
                      Lieu naissance
                    </h3>

                    <div
                      style={{
                        border: "1px solid lightgray",
                        padding: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      {renderConfig(birthplaceFields)}

                      <h3
                        className="form-label section-title"
                        style={{ color: "gray", textDecoration: "underline" }}
                      >
                        Commune
                      </h3>
                      <div
                        style={{
                          border: "1px solid lightgray",
                          padding: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        {renderConfig(communeFields)}
                      </div>
                    </div>

                    {renderConfig(contactFields)}
                  </div>

                  <div className="col-md-6">
                    <h3
                      className="form-label section-title"
                      style={{ color: "gray", textDecoration: "underline" }}
                    >
                      Adresse Postale
                    </h3>
                    <div
                      style={{
                        border: "1px solid lightgray",
                        padding: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      {renderConfig(adressePostaleFields)}
                      <h3
                        className="form-label section-title"
                        style={{ color: "gray", textDecoration: "underline" }}
                      >
                        Coordonnée Bancaire
                      </h3>
                      <div
                        style={{
                          border: "1px solid lightgray",
                          padding: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        {renderConfig(banqueFields)}
                      </div>
                    </div>
                    {renderConfig(idParticulierField)}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Column - 1/6 width */}
            <div
              className="col-2 d-flex flex-column justify-content-start"
              style={{ paddingTop: "20px" }}
            >
              <button
                className="btn btn-primary btn-sm mb-3"
                onClick={openFile}
                style={{ width: "100%" }}
              >
                Import Particulier
              </button>

              <a
                href="#"
                className="file-link mb-3"
                style={{ display: "block", textAlign: "center" }}
              >
                Fichier.json
              </a>

              <button
                className="btn btn-primary inscrire-btn"
                onClick={submit}
                style={{ width: "100%" }}
              >
                Inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptClient;
