const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const productsRouter = require('./products');
const woodsRouter = require('./woods');
const requestsRouter = require('./requests');

const app = express();
const PORT = process.env.PORT || 10000;

// ================= SECURITY =================
app.use(helmet());

// ================= CORS =================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api', limiter);

// ================= BODY PARSER =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use('/api/products', productsRouter);
app.use('/api/woods', woodsRouter);
app.use('/api/requests', requestsRouter);

// ================= ROOT CHECK =================
app.get('/', (req, res) => {
  res.send("Backend Running ✅");
});

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    time: new Date()
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error"
  });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    error: "Route Not Found"
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});