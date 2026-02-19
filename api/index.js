const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const productsRouter = require('./products');
const woodsRouter = require('./woods');
const requestsRouter = require('./requests');
const configRouter = require('./config');

const app = express();
const PORT = process.env.PORT || 10000;

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/products', productsRouter);
app.use('/api/woods', woodsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/config', configRouter);

// ✅ Health route
app.get('/', (req, res) => {
  res.send("Backend Running ✅");
});

app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    time: new Date()
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Server Error"
  });
});

// ✅ Start server (Render needs this)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});