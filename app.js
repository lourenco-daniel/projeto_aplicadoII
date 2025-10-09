// app.js - ponto de entrada da aplicação
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Pequeno method-override via query string: ?_method=PUT or DELETE
app.use((req, res, next) => {
  if (req.method === 'POST' && req.query && req.query._method) {
    req.method = req.query._method.toUpperCase();
  }
  next();
});

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rotas
const produtosRouter = require('./routes/produtos');
const authRouter = require('./routes/auth');

app.use('/produtos', produtosRouter);
app.use('/', authRouter);

// Página inicial redireciona para produtos
app.get('/', (req, res) => {
  res.redirect('/produtos');
});

// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
