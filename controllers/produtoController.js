// produtoController.js - lógica de produto com suporte a async (DB opcional)
const produtoModel = require('../models/produtoModel');

function validarDados(data) {
  const erros = [];
  if (!data.nome || !data.nome.trim()) erros.push('Nome é obrigatório');
  if (data.preco && isNaN(parseFloat(data.preco))) erros.push('Preço inválido');
  if (data.quantidade && isNaN(parseInt(data.quantidade, 10))) erros.push('Quantidade inválida');
  return erros;
}

exports.index = async (req, res) => {
  const produtos = await produtoModel.findAll();
  res.render('produtos/index', { produtos });
};

exports.novo = (req, res) => {
  res.render('produtos/form', { produto: null, errorMessage: null });
};

exports.create = async (req, res) => {
  const data = Object.assign({}, req.body);
  // se veio arquivo, armazenar caminho relativo
  if (req.file) {
    data.foto = '/uploads/' + req.file.filename;
  }
  const erros = validarDados(data);
  if (erros.length) {
    // re-render form com mensagem de erro e os dados preenchidos para ajudar debug
    return res.status(400).render('produtos/form', { produto: data, errorMessage: erros.join(', ') });
  }
  await produtoModel.create(data);
  res.redirect('/produtos');
};

exports.edit = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const produto = await produtoModel.findById(id);
  if (!produto) return res.status(404).send('Produto não encontrado');
  res.render('produtos/form', { produto, errorMessage: null });
};

exports.updateOrDelete = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const method = req.query._method && req.query._method.toUpperCase();
  if (method === 'DELETE') {
    await produtoModel.delete(id);
    return res.redirect('/produtos');
  }
  // PUT
  const data = Object.assign({}, req.body);
  if (req.file) data.foto = '/uploads/' + req.file.filename;
  const erros = validarDados(data);
  if (erros.length) {
    return res.status(400).render('produtos/form', { produto: Object.assign({ id }, data), errorMessage: erros.join(', ') });
  }
  await produtoModel.update(id, data);
  res.redirect('/produtos');
};
