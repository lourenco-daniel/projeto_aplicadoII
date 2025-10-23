const express = require("express");
const app = express();
const sequelize = require("./config/database");
const path = require("path");
// importa as rotas
const atendenteRoutes = require("./routes/atendenteRoutes");
const produtoRoutes = require("./routes/produtoRoutes"); // 👈 aqui junto com os outros consts
const mesaRoutes = require("./routes/mesaRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const itemPedidoRoutes = require("./routes/itemPedidoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");

// middlewares
app.use(express.json());

// servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

// usa as rotas
app.use("/atendentes", atendenteRoutes);
app.use("/produtos", produtoRoutes);
app.use("/mesas", mesaRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/itens-pedido", itemPedidoRoutes);
app.use("/vendas", vendaRoutes);
app.use("/relatorios", relatorioRoutes);
// rota inicial
app.get("/", (req, res) => {
  res.send("API do Food Truck rodando 🚚🔥");
});

// sincroniza banco e inicia servidor
sequelize.sync().then(() => {
  console.log("Banco sincronizado!");
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
});
