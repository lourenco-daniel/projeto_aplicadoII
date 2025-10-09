# Sistema de Pedidos - Food Truck

Projeto acadêmico - aplicação de exemplo usando Node.js, Express, EJS e MySQL/Postgres.

Instruções rápidas:

- Entrar na pasta do projeto
- Instalar dependências: npm install
- Rodar em desenvolvimento: npm run dev (requer nodemon)
- Acessar: http://localhost:3000

Usando MySQL local
1. Certifique-se que o MySQL está rodando localmente.
2. Criar um banco (por exemplo `pedidos_db`) e um usuário com permissões:

	- Acesse o MySQL (ex.: mysql -u root -p) e rode:

	  CREATE DATABASE pedidos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
	  -- Opcional: criar usuário
	  CREATE USER 'pedidos_user'@'localhost' IDENTIFIED BY 'sua_senha';
	  GRANT ALL PRIVILEGES ON pedidos_db.* TO 'pedidos_user'@'localhost';
	  FLUSH PRIVILEGES;

3. Rodar o script SQL para criar as tabelas:
	- No terminal: mysql -u pedidos_user -p pedidos_db < sql/create_tables.sql

4. Abra o arquivo `.env` e configure:

	USE_DB=true
	DB_HOST=localhost
	DB_USER=pedidos_user
	DB_PASSWORD=sua_senha
	DB_NAME=pedidos_db

5. Reinicie a aplicação: `npm start` e a aplicação usará o banco quando `USE_DB=true`.

Observações:
- O app tem fallback em memória quando `USE_DB=false` (útil para desenvolvimento sem banco).
- SQL no `sql/create_tables.sql` usa tipos padrão; para MySQL ajuste SERIAL para INT AUTO_INCREMENT se preferir.
