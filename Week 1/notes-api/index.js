const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

// Create a note
app.post("/notes", async (req, res) => {
  try {
    const id = Date.now();
    const { text } = req.body;
    await pool.query("INSERT INTO notes (id, text) VALUES ($1, $2)", [id, text]);
    res.status(201).json({ id, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a note
app.put("/notes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { text } = req.body;
    const result = await pool.query("UPDATE notes SET text = $1 WHERE id = $2 RETURNING *", [text, id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Note not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a note
app.delete("/notes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Notes API connected to PostgreSQL!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); //  http://localhost:3000
});
