const express = require('express');
const cors = require('cors');
const path = require('path');

const itemsRoutes = require('./routes/items');
const membersRoutes = require('./routes/members');
const transactionsRoutes = require('./routes/transactions');
const dashboardRoutes = require('./routes/dashboard');
const oopRoutes = require('./routes/oop');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/oop-concepts', oopRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Library Management System API'
  });
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('API Server is running. Client should be started with Vite or built.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Library Management System Server running`);
  console.log(` Port: http://localhost:${PORT}`);
  console.log(` API:  http://localhost:${PORT}/api/dashboard`);
  console.log(`===============================================`);
});
