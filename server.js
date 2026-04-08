const express = require('express');
const path = require('path');
const app = express();
app.set('case sensitive routing', true);
const PORT = process.env.PORT || 8000;

// Middleware para parsing de JSON
app.use(express.json());

function parseCookies(req) {
    const list = {};
    const rc = req.headers.cookie;

    if (rc) {
        rc.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            const key = parts.shift().trim();
            const value = decodeURI(parts.join('='));
            list[key] = value;
        });
    }

    return list;
}

// Rota raiz - redirecionar para /login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Redirecionar versões uppercase para lowercase
app.get('/LOGIN', (req, res) => {
    res.redirect('/login');
});

app.get('/DSO', (req, res) => {
    res.redirect('/dso');
});

// Rota para /login - página de login
app.get('/login', (req, res) => {
    const cookies = parseCookies(req);
    const sessionToken = cookies.spdata_session;

    if (sessionToken) {
        return res.redirect('/dso');
    }

    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para /dso - aplicação principal (requer cookie de sessão)
app.get('/dso', (req, res) => {
    const cookies = parseCookies(req);
    const sessionToken = cookies.spdata_session;

    if (!sessionToken) {
        return res.redirect('/login');
    }

    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para validação de login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Carregar usuários do arquivo JSON
    const fs = require('fs');
    const path = require('path');

    try {
        const usersPath = path.join(__dirname, 'users.json');
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const users = usersData.users || [];

        // Verificar credenciais
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Gerar um token simples para sessão
            const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

            res.cookie('spdata_session', sessionToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 4 // 4 horas
            });

            res.json({
                success: true,
                token: sessionToken,
                user: { username: user.username }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Usuário ou senha inválidos.'
            });
        }
    } catch (error) {
        console.error('Erro ao validar login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor.'
        });
    }
});

// Middleware para verificar autenticação em rotas protegidas
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || req.headers['x-user-session'];

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Acesso não autorizado.' });
    }

    // Aqui você pode implementar validação mais robusta do token
    // Por simplicidade, apenas verifica se existe
    next();
}

// API para verificar status da sessão
app.get('/api/session', requireAuth, (req, res) => {
    res.json({ success: true, authenticated: true });
});

// Middleware para servir arquivos estáticos (deve vir por último)
app.use(express.static(path.join(__dirname)));

// Tratamento de erros 404
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 SPDATA DSO Server rodando na porta ${PORT}`);
    console.log(`📱 Login: http://localhost:${PORT}/login`);
    console.log(`🏢 Aplicação: http://localhost:${PORT}/dso`);
});

module.exports = app;