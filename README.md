# 🚚 Food Truck System - Sistema de Gestão Completo

Sistema completo de gerenciamento para Food Truck com interface web moderna e funcionalidades CRUD completas.

## 🎨 Identidade Visual
- **Cores principais:** Branco, Vermelho (#C41E3A) e Dourado (#DAA520)
- Interface moderna e responsiva
- Design intuitivo e profissional

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_NAME=foodtruck_db
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

### 3. Iniciar o Servidor

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm start
```

O sistema estará disponível em: **http://localhost:3000**

## 📋 Funcionalidades

### 📊 Dashboard
- Visualização de métricas em tempo real
- Gráficos de faturamento por dia
- Análise de vendas por forma de pagamento
- Resumo geral (quantidade de vendas, faturamento total, ticket médio)

### 👥 Gerenciamento de Atendentes
- ✅ Criar novos atendentes
- ✅ Listar todos os atendentes
- ✅ Editar informações de atendentes
- ✅ Excluir atendentes
- Campos: Nome, CPF, Telefone, Login, Senha, Tipo (Gerente/Atendente)

### 🍔 Gerenciamento de Produtos
- ✅ Cadastrar novos produtos
- ✅ Listar todos os produtos
- ✅ Editar produtos existentes
- ✅ Excluir produtos
- Campos: Nome, Categoria, Preço, Estoque, Status, Foto, Descrição

### 🪑 Gerenciamento de Mesas
- ✅ Adicionar novas mesas
- ✅ Listar todas as mesas
- ✅ Atualizar status das mesas
- ✅ Remover mesas
- Status: Livre ou Ocupada

### 📝 Gerenciamento de Pedidos
- ✅ Criar novos pedidos
- ✅ Listar todos os pedidos
- ✅ Editar pedidos existentes
- ✅ Excluir pedidos
- Campos: Mesa, Atendente, Status, Forma de Pagamento, Total, Observações
- Status: Aberto, Finalizado, Pago

### 💰 Gerenciamento de Vendas
- ✅ Registrar novas vendas
- ✅ Listar todas as vendas
- ✅ Excluir vendas
- Vinculação automática com pedidos
- Formas de pagamento: PIX, Crédito, Débito, Dinheiro, Mix

## 🔌 API Endpoints

### Atendentes
- `GET /atendentes` - Lista todos
- `GET /atendentes/:id` - Busca por ID
- `POST /atendentes` - Cria novo
- `PUT /atendentes/:id` - Atualiza
- `DELETE /atendentes/:id` - Remove

### Produtos
- `GET /produtos` - Lista todos
- `GET /produtos/:id` - Busca por ID
- `POST /produtos` - Cria novo
- `PUT /produtos/:id` - Atualiza
- `DELETE /produtos/:id` - Remove

### Mesas
- `GET /mesas` - Lista todas
- `GET /mesas/:id` - Busca por ID
- `POST /mesas` - Cria nova
- `PUT /mesas/:id` - Atualiza
- `DELETE /mesas/:id` - Remove

### Pedidos
- `GET /pedidos` - Lista todos
- `GET /pedidos/:id` - Busca por ID
- `POST /pedidos` - Cria novo
- `PUT /pedidos/:id` - Atualiza
- `DELETE /pedidos/:id` - Remove

### Vendas
- `GET /vendas` - Lista todas
- `GET /vendas/:id` - Busca por ID
- `POST /vendas` - Cria nova
- `DELETE /vendas/:id` - Remove

### Relatórios
- `GET /relatorios/vendas-por-dia` - Faturamento diário
- `GET /relatorios/vendas-por-pagamento` - Vendas por forma de pagamento
- `GET /relatorios/resumo` - Resumo geral

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express 5.1.0** - Framework web
- **Sequelize 6.37.7** - ORM para MySQL
- **MySQL2** - Driver MySQL
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5 / CSS3** - Estrutura e estilização
- **JavaScript ES6+** - Lógica da aplicação
- **Chart.js** - Gráficos e visualizações

### Desenvolvimento
- **Nodemon** - Auto-reload do servidor

## 📁 Estrutura do Projeto

```
foodtruck-system/
├── public/
│   ├── index.html      # Interface principal
│   ├── style.css       # Estilos (vermelho, branco, dourado)
│   └── app.js          # Lógica do frontend
├── src/
│   ├── app.js          # Configuração do Express
│   ├── config/
│   │   └── database.js # Conexão com MySQL
│   ├── models/         # Modelos Sequelize
│   │   ├── Atendente.js
│   │   ├── Produto.js
│   │   ├── Mesa.js
│   │   ├── Pedido.js
│   │   ├── ItemPedido.js
│   │   └── Venda.js
│   ├── controllers/    # Lógica de negócio
│   │   ├── atendenteController.js
│   │   ├── produtoController.js
│   │   ├── mesaController.js
│   │   ├── pedidoController.js
│   │   ├── vendaController.js
│   │   └── relatorioController.js
│   └── routes/         # Definição de rotas
│       ├── atendenteRoutes.js
│       ├── produtoRoutes.js
│       ├── mesaRoutes.js
│       ├── pedidoRoutes.js
│       ├── vendaRoutes.js
│       └── relatorioRoutes.js
├── .env                # Variáveis de ambiente
├── package.json        # Dependências
└── README.md          # Documentação
```

## 💡 Recursos Principais

### Interface Moderna
- Design responsivo para desktop e mobile
- Navegação por abas intuitiva
- Modais para formulários
- Alertas e feedback visual
- Loading states durante requisições

### Operações CRUD Completas
Todas as entidades possuem operações completas de:
- **C**reate (Criar)
- **R**ead (Ler/Listar)
- **U**pdate (Atualizar)
- **D**elete (Excluir)

### Validações
- Campos obrigatórios marcados
- Validação de tipos de dados
- Confirmação antes de excluir
- Mensagens de erro amigáveis

## 🎯 Como Usar

1. **Acesse o sistema** em http://localhost:3000
2. **Navegue pelas abas** no menu superior
3. **Adicione registros** clicando em "Novo [Item]"
4. **Edite** clicando no botão "✏️ Editar"
5. **Exclua** clicando no botão "🗑️ Excluir"
6. **Visualize relatórios** na aba Dashboard

## 📊 Fluxo de Trabalho Recomendado

1. Cadastre **Atendentes** primeiro
2. Cadastre **Produtos** do cardápio
3. Configure as **Mesas** disponíveis
4. Crie **Pedidos** vinculando mesa e atendente
5. Registre **Vendas** ao finalizar pedidos
6. Acompanhe métricas no **Dashboard**

## 🔒 Segurança

- Senhas armazenadas no banco (recomenda-se implementar hash)
- Validação de dados no backend
- Proteção contra SQL Injection via Sequelize
- CORS configurável

## 📈 Melhorias Futuras Sugeridas

- [ ] Autenticação e autorização JWT
- [ ] Hash de senhas (bcrypt)
- [ ] Upload de imagens para produtos
- [ ] Sistema de comandas/itens do pedido
- [ ] Impressão de comandas
- [ ] Notificações em tempo real
- [ ] Backup automático
- [ ] Relatórios em PDF
- [ ] Sistema de estoque automático
- [ ] Múltiplas unidades/food trucks

## 🆘 Suporte

Em caso de problemas:
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Certifique-se que a porta 3000 está livre
4. Verifique os logs do console

## 📝 Licença

ISC

---

**Desenvolvido com ❤️ para otimizar a gestão de Food Trucks**
