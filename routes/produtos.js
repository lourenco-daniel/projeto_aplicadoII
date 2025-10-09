const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middleware/auth');

// Configuração simples do multer para salvar em public/uploads
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
		cb(null, unique);
	}
});
const upload = multer({ storage });

// Todas rotas de produtos protegidas por autenticação
router.use(authMiddleware.requireLogin);

router.get('/', produtoController.index);
router.get('/novo', produtoController.novo);
// aceita upload de arquivo com campo 'fotoFile'
router.post('/', upload.single('fotoFile'), produtoController.create);
router.get('/:id/editar', produtoController.edit);
router.post('/:id', upload.single('fotoFile'), produtoController.updateOrDelete); // usa query param _method

module.exports = router;
