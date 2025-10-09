SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS Atendente (
  id_atendente INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255),
  cpf CHAR(11),
  telefone VARCHAR(50),
  login VARCHAR(100) UNIQUE,
  senha VARCHAR(255),
  tipo_usuario VARCHAR(50),
  PRIMARY KEY (id_atendente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Mesa (
  id_mesa INT NOT NULL AUTO_INCREMENT,
  numero_mesa INT,
  status VARCHAR(50),
  PRIMARY KEY (id_mesa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Produto (
  id_produto INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) DEFAULT 0.00,
  foto VARCHAR(1024),
  categoria VARCHAR(100),
  quantidade_estoque INT DEFAULT 0,
  PRIMARY KEY (id_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Pedido (
  id_pedido INT NOT NULL AUTO_INCREMENT,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  forma_pagamento VARCHAR(100),
  status VARCHAR(100),
  observacoes TEXT,
  total DECIMAL(10,2) DEFAULT 0.00,
  id_mesa INT,
  id_atendente INT,
  PRIMARY KEY (id_pedido),
  CONSTRAINT fk_pedido_mesa FOREIGN KEY (id_mesa) REFERENCES Mesa(id_mesa) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_atendente FOREIGN KEY (id_atendente) REFERENCES Atendente(id_atendente) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Sincronizacao (
  id_sync INT NOT NULL AUTO_INCREMENT,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(100),
  id_atendente INT,
  id_pedido INT,
  PRIMARY KEY (id_sync),
  CONSTRAINT fk_sync_atendente FOREIGN KEY (id_atendente) REFERENCES Atendente(id_atendente) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sync_pedido FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Venda (
  id_venda INT NOT NULL AUTO_INCREMENT,
  id_pedido INT,
  id_atendente INT,
  id_sync INT,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  forma_pagamento VARCHAR(100),
  valor_total DECIMAL(10,2) DEFAULT 0.00,
  valor_pago DECIMAL(10,2) DEFAULT 0.00,
  troco DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(100),
  comprovante VARCHAR(255),
  observacoes TEXT,
  PRIMARY KEY (id_venda),
  CONSTRAINT fk_venda_pedido FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_venda_atendente FOREIGN KEY (id_atendente) REFERENCES Atendente(id_atendente) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_venda_sync FOREIGN KEY (id_sync) REFERENCES Sincronizacao(id_sync) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Item_Pedido (
  id_item INT NOT NULL AUTO_INCREMENT,
  quantidade INT DEFAULT 1,
  preco_unitario DECIMAL(10,2) DEFAULT 0.00,
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  id_pedido INT,
  id_produto INT,
  PRIMARY KEY (id_item),
  CONSTRAINT fk_itempedido_pedido FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_itempedido_produto FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
-- Script SQL para criar tabelas básicas
-- Compatível com MySQL e PostgreSQL usando tipos padrão quando possível

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  categoria VARCHAR(100),
  quantidade INT NOT NULL DEFAULT 0,
  foto VARCHAR(1024),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Observação: Para MySQL, SERIAL pode precisar ser ajustado para INT AUTO_INCREMENT.
