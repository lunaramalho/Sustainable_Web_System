const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

const caminhoUsuarios = path.join(__dirname, 'usuarios.json');
const caminhoMensagens = path.join(__dirname, 'mensagens.json');
const caminhoDepositos = path.join(__dirname, 'depositos.json');

const inicializarArquivoJSON = (caminho) => {
    if (!fs.existsSync(caminho)) {
        fs.writeFileSync(caminho, '[]');
    }
};

inicializarArquivoJSON(caminhoUsuarios);
inicializarArquivoJSON(caminhoMensagens);
inicializarArquivoJSON(caminhoDepositos);

app.post('/cadastrar', (req, res) => {
    const novoUsuario = req.body;

    const dados = fs.readFileSync(caminhoUsuarios, 'utf-8');
    const lista = JSON.parse(dados);

    lista.push(novoUsuario);

    fs.writeFileSync(caminhoUsuarios, JSON.stringify(lista, null, 2));

    console.log("Novo usuário salvo:", novoUsuario);

    res.json({
        sucesso: true,
        mensagem: "Usuário cadastrado com sucesso!"
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const dados = fs.readFileSync(caminhoUsuarios, 'utf-8');
    const usuarios = JSON.parse(dados);

    const usuarioEncontrado = usuarios.find(
        u => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
        console.log("Login realizado por:", usuarioEncontrado.nome);

        res.json({
            sucesso: true,
            usuario: usuarioEncontrado
        });
    } else {
        res.status(401).json({
            mensagem: "Email ou senha incorretos"
        });
    }
});

app.post('/enviar-contato', (req, res) => {
    const novaMensagem = req.body;

    const dados = fs.readFileSync(caminhoMensagens, 'utf-8');
    const lista = JSON.parse(dados);

    lista.push(novaMensagem);

    fs.writeFileSync(caminhoMensagens, JSON.stringify(lista, null, 2));

    console.log("Nova mensagem recebida:", novaMensagem);

    res.json({
        sucesso: true,
        mensagem: "Mensagem enviada com sucesso!"
    });
});

// =========================
// ROTAS DE DEPÓSITOS
// =========================
app.get('/depositos', (req, res) => {
    const dados = fs.readFileSync(caminhoDepositos, 'utf-8');
    const depositos = JSON.parse(dados);

    res.json(depositos);
});

app.post('/depositos', (req, res) => {
    const novoDeposito = req.body;

    const dados = fs.readFileSync(caminhoDepositos, 'utf-8');
    const depositos = JSON.parse(dados);

    depositos.push(novoDeposito);

    fs.writeFileSync(caminhoDepositos, JSON.stringify(depositos, null, 2));

    console.log("Novo depósito salvo:", novoDeposito);

    res.json({
        sucesso: true,
        mensagem: "Depósito salvo com sucesso!",
        deposito: novoDeposito
    });
});

app.listen(3000, () => {
    console.log("==========================================");
    console.log("Servidor rodando em http://localhost:3000");
    console.log("Acesse o site pelo link acima!");
    console.log("==========================================");
});