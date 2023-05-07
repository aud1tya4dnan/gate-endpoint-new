const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
  user: "integratif",
  password: "G3rb4ng!",
  server: "10.199.14.47",
  database: "GATE_DEV",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function checkDatabase(id_kartu_akses, id_register_gate) {
  try {
    let pool = await sql.connect(config);
    let result1 = await pool
      .request()
      .input("id_kartu_akses", sql.VarChar, id_kartu_akses)
      .query(
        "SELECT is_aktif FROM kartu_akses WHERE id_kartu_akses = @id_kartu_akses"
      );
    let result2 = await pool
      .request()
      .input("id_register_gate", sql.Int, id_register_gate)
      .query(
        "SELECT id_register_gate FROM register_gate WHERE id_register_gate = @id_register_gate"
      );
    if (result1.recordset.length > 0 && result2.recordset.length > 0) {
      return result1.recordset[0].is_aktif;
    }
  } catch (err) {
    console.error(err);
    console.log("Salah satu ID tidak ditemukan");
  }
  return 0;
}

async function logRequest(id_kartu_akses, id_register_gate, is_valid) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("id_kartu_akses", sql.VarChar, id_kartu_akses)
      .input("id_register_gate", sql.VarChar, id_register_gate)
      .input("is_valid", sql.Int, is_valid)
      .query(
        "INSERT INTO log_masuk (id_kartu_akses, id_register_gate, is_valid) VALUES (@id_kartu_akses, @id_register_gate, @is_valid)"
      );
  } catch (err) {
    console.error(err);
  }
}

async function logKeluar(id_kartu_akses, id_register_gate, is_valid) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("id_kartu_akses", sql.VarChar, id_kartu_akses)
      .input("id_register_gate", sql.VarChar, id_register_gate)
      .input("is_valid", sql.Int, is_valid)
      .query(
        "INSERT INTO log_keluar (id_kartu_akses, id_register_gate, is_valid) VALUES (@id_kartu_akses, @id_register_gate, @is_valid)"
      );
  } catch (err) {
    console.error(err);
  }
}

app.post("/masuk", async (req, res) => {
  const id_kartu_akses = req.body.idkartu;
  const id_register_gate = req.body.idgate;

  const status = await checkDatabase(id_kartu_akses, id_register_gate);
  await logRequest(id_kartu_akses, id_register_gate, status);
  res.send(`${status}`);
});

app.post("/keluar", async (req, res) => {
  const id_kartu_akses = req.body.idkartu;
  const id_register_gate = req.body.idgate;

  const status = await checkDatabase(id_kartu_akses, id_register_gate);
  await logKeluar(id_kartu_akses, id_register_gate, status);
  res.send(`${status}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
