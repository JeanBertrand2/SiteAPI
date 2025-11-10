export const isValidEmail = (email) => {
  if (!email) return false;
  return /\S+@\S+\.\S+/.test(String(email).trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\s|\./g, "").replace(/^\+/, "");
  return /^\d{9,15}$/.test(cleaned);
};

export const isValidBIC = (bic) => {
  if (!bic) return false;
  const b = String(bic).trim().toUpperCase();
  return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(b);
};

export const isValidIBAN = (iban) => {
  if (!iban) return false;
  const value = String(iban).toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z0-9]+$/.test(value)) return false;
  if (value.length < 15 || value.length > 34) return false;

  const rearranged = value.slice(4) + value.slice(0, 4);
  let numeric = "";
  for (let i = 0; i < rearranged.length; i++) {
    const ch = rearranged.charAt(i);
    if (ch >= "A" && ch <= "Z") {
      numeric += (ch.charCodeAt(0) - 55).toString();
    } else {
      numeric += ch;
    }
  }

  let remainder = 0;
  for (let offset = 0; offset < numeric.length; offset += 7) {
    const block = remainder + numeric.substr(offset, 7);
    remainder = parseInt(block, 10) % 97;
  }
  return remainder === 1;
};

export const checkRequiredFields = (formData, requiredFields) => {
  const missing = requiredFields.filter((name) => {
    const val = formData[name];
    return val === undefined || val === null || String(val).trim() === "";
  });
  return missing; 
};

export const isCodeCommuneValid = (code) => {
  return /^\d{3}$/.test(String(code || "").trim());
};

export const isCodeInseeValid = (code) => {
  return /^\d{5}$/.test(String(code || "").trim());
};

export default {
  isValidEmail,
  isValidPhone,
  isValidBIC,
  isValidIBAN,
  checkRequiredFields,
  isCodeCommuneValid,
  isCodeInseeValid,
};
