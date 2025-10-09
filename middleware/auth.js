// middleware/auth.js - proteção simples de rotas via cookie
// Em produção, trocar por sessão/JWT adequada

exports.requireLogin = (req, res, next) => {
  const cookie = req.headers.cookie;
  if (!cookie) return res.redirect('/login');
  const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith('user='));
  if (!match) return res.redirect('/login');
  try {
    const user = JSON.parse(decodeURIComponent(match.split('=')[1]));
    req.user = user;
    return next();
  } catch (e) {
    return res.redirect('/login');
  }
};
