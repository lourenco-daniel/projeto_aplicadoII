-- sample_data.sql
-- Dados de exemplo para popular o banco `sistema_pedidos`
-- Execute: mysql -u user -p sistema_pedidos < sql/sample_data.sql

START TRANSACTION;

-- ATENDENTES
INSERT INTO Atendente (id_atendente, nome, cpf, telefone, login, senha, tipo_usuario)
VALUES
  (1, 'Administrador', '00000000000', '11999990000', 'admin', 'admin', 'admin')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- MESAS
INSERT INTO Mesa (id_mesa, numero_mesa, status) VALUES
  (1, 1, 'livre'),
  (2, 2, 'livre'),
  (3, 3, 'ocupada')
ON DUPLICATE KEY UPDATE numero_mesa = VALUES(numero_mesa);

-- PRODUTOS
INSERT INTO Produto (id_produto, nome, descricao, preco, foto, categoria, quantidade_estoque) VALUES
  (1, 'Coxinha', 'Coxinha de frango tradicional', 6.50, '/uploads/coxinha.jpg', 'Salgado', 50),
  (2, 'Pastel', 'Pastel de queijo', 8.00, '/uploads/pastel.jpg', 'Salgado', 40),
  (3, 'Refrigerante Lata', 'Refrigerante 350ml', 5.00, '/uploads/refri.jpg', 'Bebida', 100),
  (4, 'Hamburguer', 'Hamburguer artesanal', 15.00, '/uploads/hamburguer.jpg', 'Sanduíche', 25),
  (5, 'Água 500ml', 'Água mineral', 3.50, '/uploads/agua.jpg', 'Bebida', 80)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), preco = VALUES(preco), quantidade_estoque = VALUES(quantidade_estoque);

-- PEDIDO DE EXEMPLO
INSERT INTO Pedido (id_pedido, data_hora, forma_pagamento, status, observacoes, total, id_mesa, id_atendente)
VALUES
  (1, NOW(), 'DINHEIRO', 'ABERTO', 'Pedido de teste', 0.00, 3, 1)
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- ITENS DO PEDIDO
-- Inserimos itens com subtotais já calculados
INSERT INTO Item_Pedido (id_item, quantidade, preco_unitario, subtotal, id_pedido, id_produto) VALUES
  (1, 2, 6.50, 13.00, 1, 1),
  (2, 1, 8.00, 8.00, 1, 2),
  (3, 1, 5.00, 5.00, 1, 3)
ON DUPLICATE KEY UPDATE quantidade = VALUES(quantidade), subtotal = VALUES(subtotal);

-- ATUALIZAR ESTOQUE (reduz estoque com base no exemplo acima)
UPDATE Produto SET quantidade_estoque = quantidade_estoque - 2 WHERE id_produto = 1;
UPDATE Produto SET quantidade_estoque = quantidade_estoque - 1 WHERE id_produto = 2;
UPDATE Produto SET quantidade_estoque = quantidade_estoque - 1 WHERE id_produto = 3;

-- ATUALIZAR TOTAL DO PEDIDO SOMANDO ITENS
UPDATE Pedido
SET total = (SELECT IFNULL(SUM(subtotal),0) FROM Item_Pedido WHERE id_pedido = 1)
WHERE id_pedido = 1;

-- INSERIR UMA VENDA (fechamento de exemplo)
INSERT INTO Venda (id_venda, id_pedido, id_atendente, id_sync, data_hora, forma_pagamento, valor_total, valor_pago, troco, status, comprovante, observacoes)
VALUES
  (1, 1, 1, NULL, NOW(), 'DINHEIRO', (SELECT total FROM Pedido WHERE id_pedido = 1), 30.00, (30.00 - (SELECT total FROM Pedido WHERE id_pedido = 1)), 'FINALIZADA', NULL, 'Pagamento de teste')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- SINCRONIZACAO DE EXEMPLO
INSERT INTO Sincronizacao (id_sync, data_hora, status, id_atendente, id_pedido)
VALUES
  (1, NOW(), 'ENVIADO', 1, 1)
ON DUPLICATE KEY UPDATE status = VALUES(status);

COMMIT;

-- Consultas rápidas para verificar os dados inseridos:
-- SELECT * FROM Atendente;
-- SELECT * FROM Mesa;
-- SELECT * FROM Produto;
-- SELECT * FROM Pedido WHERE id_pedido = 1;
-- SELECT * FROM Item_Pedido WHERE id_pedido = 1;
-- SELECT * FROM Venda WHERE id_pedido = 1;
