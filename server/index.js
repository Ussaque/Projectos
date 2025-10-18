require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Exemplo: listar transações
app.get("/api/transacoes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM transacoes ORDER BY data DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar transações" });
  }
});

// Exemplo: adicionar transação
app.post("/api/transacoes", async (req, res) => {
  const { descricao, valor, tipo, data, categoria, carteira } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO transacoes (descricao, valor, tipo, data, categoria, carteira) VALUES (?, ?, ?, ?, ?, ?)",
      [descricao, valor, tipo, data, categoria, carteira]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar transação" });
  }
});

// Exemplo: editar transação
app.put("/api/transacoes/:id", async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, tipo, data, categoria, carteira } = req.body;
  try {
    await pool.query(
      "UPDATE transacoes SET descricao=?, valor=?, tipo=?, data=?, categoria=?, carteira=? WHERE id=?",
      [descricao, valor, tipo, data, categoria, carteira, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao editar transação" });
  }
});

// Exemplo: apagar transação
app.delete("/api/transacoes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM transacoes WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar transação" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});