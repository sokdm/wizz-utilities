import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

/* ---------- APP CONFIG ---------- */
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ---------- MEMORY STORAGE ---------- */
let tempHistory = [];
let lengthHistory = [];
let calcHistory = [];

/* ---------- DASHBOARD ---------- */
app.get("/", (req, res) => {
  res.render("dashboard");
});

/* ---------- TEMPERATURE ---------- */
app.get("/temperature", (req, res) => {
  res.render("temperature", { result: null, history: tempHistory });
});

app.post("/temperature", (req, res) => {
  const c = parseFloat(req.body.celsius);
  const f = (c * 9) / 5 + 32;

  tempHistory.unshift({ input: c, result: f.toFixed(2) });
  if (tempHistory.length > 10) tempHistory.pop();

  res.render("temperature", { result: f.toFixed(2), history: tempHistory });
});

/* ---------- LENGTH ---------- */
app.get("/length", (req, res) => {
  res.render("length", { result: null, history: lengthHistory });
});

app.post("/length", (req, res) => {
  const m = parseFloat(req.body.meters);
  const ft = m * 3.28084;

  lengthHistory.unshift({ input: m, result: ft.toFixed(2) });
  if (lengthHistory.length > 10) lengthHistory.pop();

  res.render("length", { result: ft.toFixed(2), history: lengthHistory });
});

/* ---------- CALCULATOR ---------- */
app.get("/calculator", (req, res) => {
  res.render("calculator", { result: null, history: calcHistory });
});

app.post("/calculator", (req, res) => {
  const expr = req.body.expression;
  let result;

  try {
    result = eval(expr);
  } catch {
    result = "Error";
  }

  calcHistory.unshift({ expr, result });
  if (calcHistory.length > 10) calcHistory.pop();

  res.render("calculator", { result, history: calcHistory });
});

/* ---------- PASSWORD GENERATOR ---------- */
app.get("/password", (req, res) => {
  res.render("password", { result: null });
});

app.post("/password", (req, res) => {
  const length = parseInt(req.body.length);
  const numbers = req.body.numbers;
  const symbols = req.body.symbols;

  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}<>?";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  res.render("password", { result: password });
});

/* ---------- SERVER ---------- */
app.listen(PORT, () => {
  console.log(`Wiz Utilities Web running at http://localhost:${PORT}`);
});
