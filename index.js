require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get all users from the database
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Create new user in the database
app.post("/users", async (req, res) => {
  const { name, age, department } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO users (Employee_Name, Employee_Age, Employee_Department) VALUES (?, ?, ?)",
      [name, age, department]
    );
    const [newUser] = await db.query("SELECT * FROM users WHERE Employee_ID = ?", [result.insertId]);
    res.status(201).json(newUser[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// Updating user in the database
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, department } = req.body;
  try {
    await db.query(
      "UPDATE users SET Employee_Name = ?, Employee_Age = ?, Employee_Department = ? WHERE Employee_ID = ?",
      [name, age, department, id]
    );
    const [updatedUser] = await db.query("SELECT * FROM users WHERE Employee_ID = ?", [id]);
    res.json(updatedUser[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete user from the database
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE Employee_ID = ?", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// run the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
