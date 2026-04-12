const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Configurações para o Express entender os dados do seu HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Faz o servidor "enxergar" seus arquivos HTML, CSS e Imagens (Saindo da pasta backend)
app.use(express.static(path.join(__dirname, '../')));

// Caminhos dos nossos "caderninhos" JSON
const caminhoUsuarios = path.join(__dirname, 'usuarios.json');
const caminhoMensagens = path.join(__dirname, 'mensagens.json');

// Função auxiliar para garantir que o arquivo JSON existe e não quebre o código
const inicializarArquivoJSON = (caminho) => {
    if (!fs.existsSync(caminho)) {
        fs.writeFileSync(caminho, '[]');
    }
};

// Inicializa os arquivos assim que o servidor liga
inicializarArquivoJSON(caminhoUsuarios);
inicializarArquivoJSON(caminhoMensagens);

// --- ROTA DE CADASTRO ---
app.post('/cadastrar', (req, res) => {
    const novoUsuario = req.body;
    const dados = fs.readFileSync(caminhoUsuarios, 'utf-8');
    const lista = JSON.parse(dados);

    lista.push(novoUsuario);
    fs.writeFileSync(caminhoUsuarios, JSON.stringify(lista, null, 2));

    console.log("Novo usuário salvo:", novoUsuario);
    // Redireciona para a tela de cadastro (onde o usuário pode fazer login agora)
    res.redirect('/cadastro.html');
});

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const dados = fs.readFileSync(caminhoUsuarios, 'utf-8');
    const usuarios = JSON.parse(dados);

    // Procura um usuário que tenha o email e a senha iguais aos digitados
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
        console.log("Login realizado por:", usuarioEncontrado.nome);
        // REDIRECIONAMENTO PARA A HOME (Toque Final)
        res.redirect('/index.html');
    } else {
        // Se errar, volta para o login com um aviso simples
        res.send("<h1>Erro: Email ou senha incorretos!</h1><a href='/cadastro.html'>Tentar novamente</a>");
    }
});

// --- ROTA DE CONTATO ---
app.post('/enviar-contato', (req, res) => {
    const novaMensagem = req.body;
    const dados = fs.readFileSync(caminhoMensagens, 'utf-8');
    const lista = JSON.parse(dados);

    lista.push(novaMensagem);
    fs.writeFileSync(caminhoMensagens, JSON.stringify(lista, null, 2));

    console.log("Nova mensagem recebida:", novaMensagem);
    // Volta para a página de contato após enviar
    res.redirect('/contato.html');
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
    console.log("==========================================");
    console.log("Servidor rodando em http://localhost:3000");
    console.log("Acesse o site pelo link acima!");
    console.log("==========================================");
});