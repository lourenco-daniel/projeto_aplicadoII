// Configuração da API
const API_URL = "http://localhost:3000";

// Carrinho de compras global
let carrinho = [];

// Navegação entre seções
document.addEventListener("DOMContentLoaded", () => {
  // Carrega os dados iniciais
  loadDashboard();
  
  // Event listeners para navegação
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Remove active de todos
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
      
      // Adiciona active no clicado
      link.classList.add("active");
      const sectionId = link.getAttribute("data-section");
      document.getElementById(sectionId).classList.add("active");
      
      // Carrega dados da seção
      loadSectionData(sectionId);
    });
  });
});

// Carrega dados conforme a seção
function loadSectionData(section) {
  switch(section) {
    case "dashboard":
      loadDashboard();
      break;
    case "atendentes":
      loadAtendentes();
      break;
    case "produtos":
      loadProdutos();
      break;
    case "mesas":
      loadMesas();
      break;
    case "pedidos":
      loadPedidos();
      break;
    case "vendas":
      loadVendas();
      break;
  }
}

// ========== ALERTAS ==========
function showAlert(message, type = "success") {
  const alertContainer = document.getElementById("alertContainer");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} show`;
  alert.textContent = message;
  
  alertContainer.innerHTML = "";
  alertContainer.appendChild(alert);
  
  setTimeout(() => {
    alert.classList.remove("show");
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// ========== MODAIS ==========
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// Fecha modal ao clicar fora
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active");
  }
});

// ========== DASHBOARD ==========
async function loadDashboard() {
  try {
    // Resumo geral
    const resumo = await fetch(`${API_URL}/relatorios/resumo`).then(r => r.json());
    document.getElementById("statVendas").textContent = resumo.quantidade_vendas || 0;
    document.getElementById("statFaturamento").textContent = `R$ ${parseFloat(resumo.faturamento_total || 0).toFixed(2)}`;
    document.getElementById("statTicket").textContent = `R$ ${parseFloat(resumo.ticket_medio || 0).toFixed(2)}`;

    // Faturamento por dia
    const vendasDia = await fetch(`${API_URL}/relatorios/vendas-por-dia`).then(r => r.json());
    const labels = vendasDia.map(d => new Date(d.data).toLocaleDateString("pt-BR"));
    const valores = vendasDia.map(d => parseFloat(d.total_vendas));

    new Chart(document.getElementById("chartVendasDia"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Faturamento (R$)",
          data: valores,
          borderColor: "#C41E3A",
          backgroundColor: "rgba(196, 30, 58, 0.1)",
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });

    // Vendas por pagamento
    const vendasPagamento = await fetch(`${API_URL}/relatorios/vendas-por-pagamento`).then(r => r.json());
    const labelsPag = vendasPagamento.map(d => d.forma_pagamento.toUpperCase());
    const valoresPag = vendasPagamento.map(d => parseFloat(d.total_vendas));

    new Chart(document.getElementById("chartPagamento"), {
      type: "pie",
      data: {
        labels: labelsPag,
        datasets: [{
          data: valoresPag,
          backgroundColor: ["#C41E3A", "#DAA520", "#8B1228", "#B8860B", "#FFD700"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    showAlert("Erro ao carregar dados do dashboard", "error");
  }
}

// ========== ATENDENTES ==========
async function loadAtendentes() {
  const loading = document.getElementById("loadingAtendentes");
  const tbody = document.getElementById("atendenteTableBody");
  
  loading.classList.add("show");
  tbody.innerHTML = "";
  
  try {
    const response = await fetch(`${API_URL}/atendentes`);
    const atendentes = await response.json();
    
    if (atendentes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #999;">Nenhum atendente cadastrado</td></tr>';
    } else {
      atendentes.forEach(atendente => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${atendente.id_atendente}</td>
          <td>${atendente.nome}</td>
          <td>${atendente.cpf}</td>
          <td>${atendente.telefone || "-"}</td>
          <td>${atendente.login}</td>
          <td><span class="status-badge">${atendente.tipo_usuario}</span></td>
          <td class="actions">
            <button class="action-btn action-edit" onclick="editAtendente(${atendente.id_atendente})">✏️ Editar</button>
            <button class="action-btn action-delete" onclick="deleteAtendente(${atendente.id_atendente})">🗑️ Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar atendentes:", error);
    showAlert("Erro ao carregar atendentes", "error");
  } finally {
    loading.classList.remove("show");
  }
}

function openAtendenteModal(id = null) {
  const modal = document.getElementById("atendenteModal");
  const form = document.getElementById("atendenteForm");
  const title = document.getElementById("atendenteModalTitle");
  
  form.reset();
  document.getElementById("atendenteId").value = "";
  
  if (id) {
    title.textContent = "Editar Atendente";
    // Carrega dados do atendente
    fetch(`${API_URL}/atendentes/${id}`)
      .then(r => r.json())
      .then(atendente => {
        document.getElementById("atendenteId").value = atendente.id_atendente;
        document.getElementById("atendenteNome").value = atendente.nome;
        document.getElementById("atendenteCpf").value = atendente.cpf;
        document.getElementById("atendenteTelefone").value = atendente.telefone || "";
        document.getElementById("atendenteLogin").value = atendente.login;
        document.getElementById("atendenteSenha").value = atendente.senha;
        document.getElementById("atendenteTipo").value = atendente.tipo_usuario;
      });
  } else {
    title.textContent = "Novo Atendente";
  }
  
  modal.classList.add("active");
}

async function editAtendente(id) {
  openAtendenteModal(id);
}

document.getElementById("atendenteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const id = document.getElementById("atendenteId").value;
  const data = {
    nome: document.getElementById("atendenteNome").value,
    cpf: document.getElementById("atendenteCpf").value,
    telefone: document.getElementById("atendenteTelefone").value,
    login: document.getElementById("atendenteLogin").value,
    senha: document.getElementById("atendenteSenha").value,
    tipo_usuario: document.getElementById("atendenteTipo").value
  };
  
  try {
    const url = id ? `${API_URL}/atendentes/${id}` : `${API_URL}/atendentes`;
    const method = id ? "PUT" : "POST";
    
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showAlert(id ? "Atendente atualizado com sucesso!" : "Atendente criado com sucesso!", "success");
      closeModal("atendenteModal");
      loadAtendentes();
    } else {
      const error = await response.json();
      showAlert(error.message || "Erro ao salvar atendente", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao salvar atendente", "error");
  }
});

async function deleteAtendente(id) {
  if (!confirm("Tem certeza que deseja excluir este atendente?")) return;
  
  try {
    const response = await fetch(`${API_URL}/atendentes/${id}`, { method: "DELETE" });
    
    if (response.ok) {
      showAlert("Atendente excluído com sucesso!", "success");
      loadAtendentes();
    } else {
      showAlert("Erro ao excluir atendente", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao excluir atendente", "error");
  }
}

// ========== PRODUTOS ==========
async function loadProdutos() {
  const loading = document.getElementById("loadingProdutos");
  const tbody = document.getElementById("produtoTableBody");
  
  loading.classList.add("show");
  tbody.innerHTML = "";
  
  try {
    const response = await fetch(`${API_URL}/produtos`);
    const produtos = await response.json();
    
    if (produtos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #999;">Nenhum produto cadastrado</td></tr>';
    } else {
      produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${produto.id_produto}</td>
          <td>${produto.nome}</td>
          <td>${produto.categoria || "-"}</td>
          <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
          <td>${produto.quantidade_estoque}</td>
          <td><span class="status-badge status-${produto.status}">${produto.status}</span></td>
          <td class="actions">
            <button class="action-btn action-edit" onclick="editProduto(${produto.id_produto})">✏️ Editar</button>
            <button class="action-btn action-delete" onclick="deleteProduto(${produto.id_produto})">🗑️ Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    showAlert("Erro ao carregar produtos", "error");
  } finally {
    loading.classList.remove("show");
  }
}

function openProdutoModal(id = null) {
  const modal = document.getElementById("produtoModal");
  const form = document.getElementById("produtoForm");
  const title = document.getElementById("produtoModalTitle");
  
  form.reset();
  document.getElementById("produtoId").value = "";
  
  if (id) {
    title.textContent = "Editar Produto";
    fetch(`${API_URL}/produtos/${id}`)
      .then(r => r.json())
      .then(produto => {
        document.getElementById("produtoId").value = produto.id_produto;
        document.getElementById("produtoNome").value = produto.nome;
        document.getElementById("produtoCategoria").value = produto.categoria || "";
        document.getElementById("produtoPreco").value = produto.preco;
        document.getElementById("produtoEstoque").value = produto.quantidade_estoque;
        document.getElementById("produtoStatus").value = produto.status;
        document.getElementById("produtoFoto").value = produto.foto || "";
        document.getElementById("produtoDescricao").value = produto.descricao || "";
      });
  } else {
    title.textContent = "Novo Produto";
  }
  
  modal.classList.add("active");
}

async function editProduto(id) {
  openProdutoModal(id);
}

document.getElementById("produtoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const id = document.getElementById("produtoId").value;
  const data = {
    nome: document.getElementById("produtoNome").value,
    categoria: document.getElementById("produtoCategoria").value,
    preco: parseFloat(document.getElementById("produtoPreco").value),
    quantidade_estoque: parseInt(document.getElementById("produtoEstoque").value),
    status: document.getElementById("produtoStatus").value,
    foto: document.getElementById("produtoFoto").value,
    descricao: document.getElementById("produtoDescricao").value
  };
  
  try {
    const url = id ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`;
    const method = id ? "PUT" : "POST";
    
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showAlert(id ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!", "success");
      closeModal("produtoModal");
      loadProdutos();
    } else {
      showAlert("Erro ao salvar produto", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao salvar produto", "error");
  }
});

async function deleteProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  
  try {
    const response = await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" });
    
    if (response.ok) {
      showAlert("Produto excluído com sucesso!", "success");
      loadProdutos();
    } else {
      showAlert("Erro ao excluir produto", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao excluir produto", "error");
  }
}

// ========== MESAS ==========
async function loadMesas() {
  const loading = document.getElementById("loadingMesas");
  const tbody = document.getElementById("mesaTableBody");
  
  loading.classList.add("show");
  tbody.innerHTML = "";
  
  try {
    const response = await fetch(`${API_URL}/mesas`);
    const mesas = await response.json();
    
    if (mesas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #999;">Nenhuma mesa cadastrada</td></tr>';
    } else {
      mesas.forEach(mesa => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${mesa.id_mesa}</td>
          <td>${mesa.numero_mesa}</td>
          <td><span class="status-badge status-${mesa.status}">${mesa.status}</span></td>
          <td class="actions">
            <button class="action-btn action-edit" onclick="editMesa(${mesa.id_mesa})">✏️ Editar</button>
            <button class="action-btn action-delete" onclick="deleteMesa(${mesa.id_mesa})">🗑️ Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar mesas:", error);
    showAlert("Erro ao carregar mesas", "error");
  } finally {
    loading.classList.remove("show");
  }
}

function openMesaModal(id = null) {
  const modal = document.getElementById("mesaModal");
  const form = document.getElementById("mesaForm");
  const title = document.getElementById("mesaModalTitle");
  
  form.reset();
  document.getElementById("mesaId").value = "";
  
  if (id) {
    title.textContent = "Editar Mesa";
    fetch(`${API_URL}/mesas/${id}`)
      .then(r => r.json())
      .then(mesa => {
        document.getElementById("mesaId").value = mesa.id_mesa;
        document.getElementById("mesaNumero").value = mesa.numero_mesa;
        document.getElementById("mesaStatus").value = mesa.status;
      });
  } else {
    title.textContent = "Nova Mesa";
  }
  
  modal.classList.add("active");
}

async function editMesa(id) {
  openMesaModal(id);
}

document.getElementById("mesaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const id = document.getElementById("mesaId").value;
  const data = {
    numero_mesa: parseInt(document.getElementById("mesaNumero").value),
    status: document.getElementById("mesaStatus").value
  };
  
  try {
    const url = id ? `${API_URL}/mesas/${id}` : `${API_URL}/mesas`;
    const method = id ? "PUT" : "POST";
    
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showAlert(id ? "Mesa atualizada com sucesso!" : "Mesa criada com sucesso!", "success");
      closeModal("mesaModal");
      loadMesas();
    } else {
      showAlert("Erro ao salvar mesa", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao salvar mesa", "error");
  }
});

async function deleteMesa(id) {
  if (!confirm("Tem certeza que deseja excluir esta mesa?")) return;
  
  try {
    const response = await fetch(`${API_URL}/mesas/${id}`, { method: "DELETE" });
    
    if (response.ok) {
      showAlert("Mesa excluída com sucesso!", "success");
      loadMesas();
    } else {
      showAlert("Erro ao excluir mesa", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao excluir mesa", "error");
  }
}

// ========== PEDIDOS ==========
async function loadPedidos() {
  // Carrega o cardápio
  await loadCardapio();
  
  // Carrega mesas e atendentes para o carrinho
  await loadMesasCarrinho();
  await loadAtendentesCarrinho();
  
  // Carrega lista de pedidos realizados
  const loading = document.getElementById("loadingPedidos");
  const tbody = document.getElementById("pedidoTableBody");
  
  loading.classList.add("show");
  tbody.innerHTML = "";
  
  try {
    const response = await fetch(`${API_URL}/pedidos`);
    const pedidos = await response.json();
    
    if (pedidos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #999;">Nenhum pedido cadastrado</td></tr>';
    } else {
      pedidos.forEach(pedido => {
        const tr = document.createElement("tr");
        const dataHora = new Date(pedido.data_hora).toLocaleString("pt-BR");
        tr.innerHTML = `
          <td>${pedido.id_pedido}</td>
          <td>${dataHora}</td>
          <td>Mesa ${pedido.Mesa?.numero_mesa || "-"}</td>
          <td>${pedido.Atendente?.nome || "-"}</td>
          <td><span class="status-badge status-${pedido.status}">${pedido.status}</span></td>
          <td>${pedido.forma_pagamento || "-"}</td>
          <td>R$ ${parseFloat(pedido.total).toFixed(2)}</td>
          <td class="actions">
            <button class="action-btn action-edit" onclick="editPedido(${pedido.id_pedido})">✏️ Editar</button>
            <button class="action-btn action-delete" onclick="deletePedido(${pedido.id_pedido})">🗑️ Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    showAlert("Erro ao carregar pedidos", "error");
  } finally {
    loading.classList.remove("show");
  }
}

// Carrega o cardápio de produtos
async function loadCardapio() {
  const loading = document.getElementById("loadingCardapio");
  const grid = document.getElementById("cardapioGrid");
  
  loading.classList.add("show");
  grid.innerHTML = "";
  
  try {
    const response = await fetch(`${API_URL}/produtos`);
    const produtos = await response.json();
    
    // Filtra apenas produtos ativos
    const produtosAtivos = produtos.filter(p => p.status === 'ativo');
    
    if (produtosAtivos.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍔</div><p>Nenhum produto disponível no momento</p></div>';
    } else {
      produtosAtivos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto-card";
        
        const semEstoque = produto.quantidade_estoque === 0;
        const imagemUrl = produto.foto || '';
        const ingredientes = produto.descricao || 'Delicioso produto do nosso cardápio';
        
        card.innerHTML = `
          <div class="produto-imagem">
            ${imagemUrl ? `<img src="${imagemUrl}" alt="${produto.nome}" onerror="this.parentElement.innerHTML='🍔'">` : '🍔'}
          </div>
          ${semEstoque ? '<div class="produto-estoque">Sem Estoque</div>' : ''}
          <div class="produto-info">
            <h3 class="produto-nome">${produto.nome}</h3>
            ${produto.categoria ? `<span class="produto-categoria">${produto.categoria}</span>` : ''}
            <p class="produto-ingredientes">${ingredientes}</p>
            <div class="produto-footer">
              <div class="produto-preco">
                <small>R$</small> ${parseFloat(produto.preco).toFixed(2)}
              </div>
              <button 
                class="btn-add-produto" 
                onclick="adicionarAoCarrinho(${produto.id_produto})"
                ${semEstoque ? 'disabled' : ''}
              >
                ➕ Adicionar
              </button>
            </div>
          </div>
        `;
        
        grid.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar cardápio:", error);
    showAlert("Erro ao carregar cardápio", "error");
  } finally {
    loading.classList.remove("show");
  }
}

// Adiciona produto ao carrinho
async function adicionarAoCarrinho(idProduto) {
  try {
    const response = await fetch(`${API_URL}/produtos/${idProduto}`);
    const produto = await response.json();
    
    // Verifica se já está no carrinho
    const itemExistente = carrinho.find(item => item.id_produto === idProduto);
    
    if (itemExistente) {
      // Verifica estoque antes de aumentar quantidade
      if (itemExistente.quantidade < produto.quantidade_estoque) {
        itemExistente.quantidade++;
        showAlert(`Quantidade de ${produto.nome} aumentada!`, "success");
      } else {
        showAlert(`Estoque insuficiente de ${produto.nome}`, "error");
        return;
      }
    } else {
      // Adiciona novo item
      carrinho.push({
        id_produto: produto.id_produto,
        nome: produto.nome,
        preco: parseFloat(produto.preco),
        quantidade: 1,
        foto: produto.foto,
        estoque_maximo: produto.quantidade_estoque
      });
      showAlert(`${produto.nome} adicionado ao carrinho!`, "success");
    }
    
    atualizarCarrinho();
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    showAlert("Erro ao adicionar produto", "error");
  }
}

// Atualiza a visualização do carrinho
function atualizarCarrinho() {
  const carrinhoDiv = document.getElementById("carrinhoItens");
  
  if (carrinho.length === 0) {
    carrinhoDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <p>Carrinho vazio. Adicione produtos do cardápio acima.</p>
      </div>
    `;
    document.getElementById("carrinhoTotal").textContent = "R$ 0,00";
    return;
  }
  
  let html = '';
  let total = 0;
  
  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    
    html += `
      <div class="carrinho-item">
        <div class="carrinho-item-imagem">
          ${item.foto ? `<img src="${item.foto}" alt="${item.nome}" onerror="this.parentElement.innerHTML='🍔'">` : '🍔'}
        </div>
        <div class="carrinho-item-info">
          <div class="carrinho-item-nome">${item.nome}</div>
          <div class="carrinho-item-preco">R$ ${item.preco.toFixed(2)} cada</div>
        </div>
        <div class="carrinho-item-controls">
          <button class="btn-quantidade" onclick="diminuirQuantidade(${index})">-</button>
          <span class="carrinho-item-quantidade">${item.quantidade}</span>
          <button class="btn-quantidade" onclick="aumentarQuantidade(${index})">+</button>
        </div>
        <div class="carrinho-item-subtotal">R$ ${subtotal.toFixed(2)}</div>
        <button class="btn-remover-item" onclick="removerItem(${index})">🗑️</button>
      </div>
    `;
  });
  
  carrinhoDiv.innerHTML = html;
  document.getElementById("carrinhoTotal").textContent = `R$ ${total.toFixed(2)}`;
}

// Aumenta quantidade de um item
function aumentarQuantidade(index) {
  const item = carrinho[index];
  
  if (item.quantidade < item.estoque_maximo) {
    item.quantidade++;
    atualizarCarrinho();
  } else {
    showAlert("Estoque insuficiente", "error");
  }
}

// Diminui quantidade de um item
function diminuirQuantidade(index) {
  const item = carrinho[index];
  
  if (item.quantidade > 1) {
    item.quantidade--;
    atualizarCarrinho();
  } else {
    removerItem(index);
  }
}

// Remove um item do carrinho
function removerItem(index) {
  const item = carrinho[index];
  carrinho.splice(index, 1);
  showAlert(`${item.nome} removido do carrinho`, "info");
  atualizarCarrinho();
}

// Limpa todo o carrinho
function limparCarrinho() {
  if (carrinho.length === 0) {
    showAlert("Carrinho já está vazio", "info");
    return;
  }
  
  if (confirm("Deseja limpar todo o carrinho?")) {
    carrinho = [];
    atualizarCarrinho();
    showAlert("Carrinho limpo com sucesso", "success");
  }
}

// Carrega mesas para o carrinho
async function loadMesasCarrinho() {
  try {
    const response = await fetch(`${API_URL}/mesas`);
    const mesas = await response.json();
    const select = document.getElementById("carrinhoMesa");
    
    select.innerHTML = '<option value="">Selecione a mesa...</option>';
    
    // Filtra apenas mesas livres
    const mesasLivres = mesas.filter(m => m.status === 'livre');
    
    mesasLivres.forEach(mesa => {
      const option = document.createElement("option");
      option.value = mesa.id_mesa;
      option.textContent = `Mesa ${mesa.numero_mesa}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar mesas:", error);
  }
}

// Carrega atendentes para o carrinho
async function loadAtendentesCarrinho() {
  try {
    const response = await fetch(`${API_URL}/atendentes`);
    const atendentes = await response.json();
    const select = document.getElementById("carrinhoAtendente");
    
    select.innerHTML = '<option value="">Selecione o atendente...</option>';
    atendentes.forEach(atendente => {
      const option = document.createElement("option");
      option.value = atendente.id_atendente;
      option.textContent = atendente.nome;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar atendentes:", error);
  }
}

// Finaliza o pedido
async function finalizarPedido() {
  const idMesa = document.getElementById("carrinhoMesa").value;
  const idAtendente = document.getElementById("carrinhoAtendente").value;
  
  // Validações
  if (!idMesa) {
    showAlert("Selecione uma mesa para o pedido", "error");
    return;
  }
  
  if (!idAtendente) {
    showAlert("Selecione um atendente para o pedido", "error");
    return;
  }
  
  if (carrinho.length === 0) {
    showAlert("Adicione produtos ao carrinho antes de finalizar", "error");
    return;
  }
  
  // Calcula total
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  
  // Cria o pedido
  const pedidoData = {
    id_mesa: parseInt(idMesa),
    id_atendente: parseInt(idAtendente),
    status: "aberto",
    total: total,
    observacoes: `Pedido com ${carrinho.length} item(ns): ${carrinho.map(i => `${i.nome} (${i.quantidade}x)`).join(', ')}`
  };
  
  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidoData)
    });
    
    if (response.ok) {
      const pedido = await response.json();
      
      // Atualiza status da mesa para ocupada
      await fetch(`${API_URL}/mesas/${idMesa}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ocupada" })
      });
      
      showAlert(`Pedido #${pedido.id_pedido} criado com sucesso!`, "success");
      
      // Limpa o carrinho
      carrinho = [];
      atualizarCarrinho();
      
      // Limpa seleções
      document.getElementById("carrinhoMesa").value = "";
      document.getElementById("carrinhoAtendente").value = "";
      
      // Recarrega dados
      loadPedidos();
      
    } else {
      const error = await response.json();
      showAlert(error.message || "Erro ao criar pedido", "error");
    }
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
    showAlert("Erro ao finalizar pedido", "error");
  }
}

async function openPedidoModal(id = null) {
  const modal = document.getElementById("pedidoModal");
  const form = document.getElementById("pedidoForm");
  const title = document.getElementById("pedidoModalTitle");
  
  form.reset();
  document.getElementById("pedidoId").value = "";
  
  // Carrega mesas e atendentes para os selects
  await loadMesasSelect();
  await loadAtendentesSelect();
  
  if (id) {
    title.textContent = "Editar Pedido";
    fetch(`${API_URL}/pedidos/${id}`)
      .then(r => r.json())
      .then(pedido => {
        document.getElementById("pedidoId").value = pedido.id_pedido;
        document.getElementById("pedidoMesa").value = pedido.id_mesa;
        document.getElementById("pedidoAtendente").value = pedido.id_atendente;
        document.getElementById("pedidoStatus").value = pedido.status;
        document.getElementById("pedidoPagamento").value = pedido.forma_pagamento || "";
        document.getElementById("pedidoTotal").value = pedido.total;
        document.getElementById("pedidoObservacoes").value = pedido.observacoes || "";
      });
  } else {
    title.textContent = "Novo Pedido";
  }
  
  modal.classList.add("active");
}

async function loadMesasSelect() {
  try {
    const response = await fetch(`${API_URL}/mesas`);
    const mesas = await response.json();
    const select = document.getElementById("pedidoMesa");
    
    select.innerHTML = '<option value="">Selecione...</option>';
    mesas.forEach(mesa => {
      const option = document.createElement("option");
      option.value = mesa.id_mesa;
      option.textContent = `Mesa ${mesa.numero_mesa} - ${mesa.status}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar mesas:", error);
  }
}

async function loadAtendentesSelect() {
  try {
    const response = await fetch(`${API_URL}/atendentes`);
    const atendentes = await response.json();
    const select = document.getElementById("pedidoAtendente");
    
    select.innerHTML = '<option value="">Selecione...</option>';
    atendentes.forEach(atendente => {
      const option = document.createElement("option");
      option.value = atendente.id_atendente;
      option.textContent = atendente.nome;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar atendentes:", error);
  }
}

async function editPedido(id) {
  openPedidoModal(id);
}

document.getElementById("pedidoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const id = document.getElementById("pedidoId").value;
  const data = {
    id_mesa: parseInt(document.getElementById("pedidoMesa").value),
    id_atendente: parseInt(document.getElementById("pedidoAtendente").value),
    status: document.getElementById("pedidoStatus").value,
    forma_pagamento: document.getElementById("pedidoPagamento").value || null,
    total: parseFloat(document.getElementById("pedidoTotal").value),
    observacoes: document.getElementById("pedidoObservacoes").value
  };
  
  try {
    const url = id ? `${API_URL}/pedidos/${id}` : `${API_URL}/pedidos`;
    const method = id ? "PUT" : "POST";
    
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showAlert(id ? "Pedido atualizado com sucesso!" : "Pedido criado com sucesso!", "success");
      closeModal("pedidoModal");
      loadPedidos();
    } else {
      showAlert("Erro ao salvar pedido", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao salvar pedido", "error");
  }
});

async function deletePedido(id) {
  if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
  
  try {
    const response = await fetch(`${API_URL}/pedidos/${id}`, { method: "DELETE" });
    
    if (response.ok) {
      showAlert("Pedido excluído com sucesso!", "success");
      loadPedidos();
    } else {
      showAlert("Erro ao excluir pedido", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao excluir pedido", "error");
  }
}

// ========== VENDAS ==========
async function loadVendas() {
  const loading = document.getElementById("loadingVendas");
  const tbody = document.getElementById("vendaTableBody");
  
  loading.classList.add("show");
  tbody.innerHTML = "";
  
  try {
    const response = await fetch(`${API_URL}/vendas`);
    const vendas = await response.json();
    
    if (vendas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #999;">Nenhuma venda cadastrada</td></tr>';
    } else {
      vendas.forEach(venda => {
        const tr = document.createElement("tr");
        const dataHora = new Date(venda.data_hora).toLocaleString("pt-BR");
        tr.innerHTML = `
          <td>${venda.id_venda}</td>
          <td>${dataHora}</td>
          <td>#${venda.id_pedido}</td>
          <td>R$ ${parseFloat(venda.valor_total).toFixed(2)}</td>
          <td><span class="status-badge">${venda.forma_pagamento}</span></td>
          <td class="actions">
            <button class="action-btn action-delete" onclick="deleteVenda(${venda.id_venda})">🗑️ Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar vendas:", error);
    showAlert("Erro ao carregar vendas", "error");
  } finally {
    loading.classList.remove("show");
  }
}

async function openVendaModal() {
  const modal = document.getElementById("vendaModal");
  const form = document.getElementById("vendaForm");
  const title = document.getElementById("vendaModalTitle");
  
  form.reset();
  document.getElementById("vendaId").value = "";
  title.textContent = "Nova Venda";
  
  // Carrega pedidos para o select
  await loadPedidosSelect();
  
  modal.classList.add("active");
}

async function loadPedidosSelect() {
  try {
    const response = await fetch(`${API_URL}/pedidos`);
    const pedidos = await response.json();
    const select = document.getElementById("vendaPedido");
    
    select.innerHTML = '<option value="">Selecione...</option>';
    pedidos.forEach(pedido => {
      const option = document.createElement("option");
      option.value = pedido.id_pedido;
      option.textContent = `Pedido #${pedido.id_pedido} - Mesa ${pedido.Mesa?.numero_mesa || "-"} - R$ ${parseFloat(pedido.total).toFixed(2)}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
  }
}

document.getElementById("vendaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const data = {
    id_pedido: parseInt(document.getElementById("vendaPedido").value),
    forma_pagamento: document.getElementById("vendaPagamento").value,
    valor_total: parseFloat(document.getElementById("vendaValor").value)
  };
  
  try {
    const response = await fetch(`${API_URL}/vendas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showAlert("Venda criada com sucesso!", "success");
      closeModal("vendaModal");
      loadVendas();
      loadDashboard(); // Atualiza dashboard
    } else {
      const error = await response.json();
      showAlert(error.message || "Erro ao salvar venda", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao salvar venda", "error");
  }
});

async function deleteVenda(id) {
  if (!confirm("Tem certeza que deseja excluir esta venda?")) return;
  
  try {
    const response = await fetch(`${API_URL}/vendas/${id}`, { method: "DELETE" });
    
    if (response.ok) {
      showAlert("Venda excluída com sucesso!", "success");
      loadVendas();
      loadDashboard(); // Atualiza dashboard
    } else {
      showAlert("Erro ao excluir venda", "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    showAlert("Erro ao excluir venda", "error");
  }
}
