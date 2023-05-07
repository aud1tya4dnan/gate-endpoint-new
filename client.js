const axios = require("axios");

const serverUrl = "http://localhost:3000";

async function masuk(id_kartu_akses, id_register_gate) {
  try {
    const response = await axios.post(`${serverUrl}/masuk`, {
      id_kartu_akses,
      id_register_gate,
    });
    console.log("Status masuk:", response.data);
  } catch (error) {
    console.error("Error pada masuk:", error.message);
  }
}

async function keluar(id_kartu_akses, id_register_gate) {
  try {
    const response = await axios.post(`${serverUrl}/keluar`, {
      id_kartu_akses,
      id_register_gate,
    });
    console.log("Status keluar:", response.data);
  } catch (error) {
    console.error("Error pada keluar:", error.message);
  }
}

// Contoh penggunaan:
const id_kartu_akses = "0900990099383832";
const id_register_gate = 1;

masuk(id_kartu_akses, id_register_gate);
keluar(id_kartu_akses, id_register_gate);