const express = require("express"); // trazendo do node module a dependência do express
const path = require("path");
const fs = require("fs");
const app = express(); // método de incialização do express
const PORT = 3000;


app.use(express.static("public")); // Se estiver numa pasta public
app.use(express.static(path.join(__dirname, "views"))); // __dirname garante que qualquer sistema operacional irá tratar as pastas de forma padrão
app.use(express.urlencoded({ extended: true })); // middleware do express que trata o tipo de dado enviado pelo formulário do html -> para json

app.listen(PORT, () => {
  console.log(`Servidor   porta ${PORT}`);
});
app.get("/not-found", (req, res) => {
  res.status(404).send("<h1> Ah não.. página não encontrada </h1>");
});

// Rota raíz que envia o index.html, exibindo o cardápio da DevBurger, e um formulário para que os clientes possam sugerir um novo sabor de lanche.
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/index.html");
});

app.get("/sugestao", (req, res) => {
  const nome = req.query.nome;
  const email = req.query.email;
  const nomeLanche = req.query.nomeLanche;
  const descricao = req.query.descricao;
  const ingredientes = req.query.ingredientes;

  res.status(200).send(`
        
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sugestão recebida!</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #ff6b35, #f7931e);
                    min-height: 100vh;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                
                main {
                    max-width: 600px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    color: #d32f2f;
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                h2 {
                    color: #f7931e;
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .label {
                    color: #d32f2f;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .description {
                    color: #666;
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                
                button {
                    background: linear-gradient(135deg, #d32f2f, #f7931e);
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    display: block;
                    margin: 30px auto 0;
                }
                
                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
            </style>
        </head>
        <body>
            <main>
                <h1>${nome} agradecemos pela sua sugestão!</h1>
                <h2>Nós iremos analisar o seu pedido com carinho...</h2>
                <p class="label">Nome do lanche: ${nomeLanche}</p>
                <p class="description">Descrição do lanche: ${descricao}</p>
                <p class="label">Ingredientes: ${ingredientes}</p>
                <p class="description">Você receberá um aviso no email ${email} caso o seu lanche seja selecionado como novidade no cardápio!!</p>
                <a href="/"><button>Voltar para a página inicial</button></a>
            </main>
        </body>
        </html>
    `);
});

app.get("/contato", (res, req) => {
  req.status(200).sendFile(__dirname + "/views/contato.html");
});

let ultimoContato = null;

app.post("/contato", (req, res) => {
  ultimoContato = req.body;
  res.status(200).redirect("/contato-recebido");
});

app.get("/contato-recebido", (req, res) => {
  if (!ultimoContato) {
    return res.status(404).redirect("404.html");
  }
  const { nome, email, assunto, mensagem } = ultimoContato;
  res.status(200).send(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Sugestão recebida!</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background: linear-gradient(135deg, #ff6b35, #f7931e);
                            min-height: 100vh;
                            color: #333;
                            margin: 0;
                            padding: 20px;
                        }
                        
                        main {
                            max-width: 600px;
                            margin: 0 auto;
                            background: rgba(255, 255, 255, 0.95);
                            padding: 30px;
                            border-radius: 15px;
                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                        }
                        
                        h1 {
                            color: #d32f2f;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        
                        h2 {
                            color: #f7931e;
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        
                        .label {
                            color: #d32f2f;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        
                        .description {
                            color: #666;
                            margin-bottom: 20px;
                            line-height: 1.6;
                        }
                        
                        button {
                            background: linear-gradient(135deg, #d32f2f, #f7931e);
                            color: white;
                            padding: 15px 30px;
                            border: none;
                            border-radius: 8px;
                            font-size: 1.1em;
                            font-weight: bold;
                            cursor: pointer;
                            display: block;
                            margin: 30px auto 0;
                        }
                        
                        button:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <h1>${nome} agradecemos pela mensagem!</h1>
                        <p class="label">Assunto ${assunto}</p>
                        <p class="description">Descrição do lanche: ${mensagem}</p>
                        <p class="description">Você receberá uma resposta em: ${email} </p>
                        <a href="/"><button>Voltar para a página inicial</button></a>
                    </main>
                </body>
                </html>
        
        `);
});

app.get("/api/lanches", (req, res) => {
  const caminho = path.join(__dirname, "public", "data", "lanches.json");
  fs.readFile(caminho, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao ler arquivo JSON" });
    }
    const json = JSON.parse(data);
    res.status(200).json(json);
  });
});


app.use((req,res)=>{
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});

// app.post('/contato', (req,res) => {
//     ultimoContato = req.body; //peguei o dado do body e passei pra outra rota
//     res.redirect('/contato-recebido'); // redirecionei pra cá..
// });

// // localhost:3000/contato-recebido?nome=Bruno&email=bruno@gmail.com -> exemplo aqui de como seria uma rota de query, se usa com dados não sensíveis...

// // a rota ainda não existe por isso tenho que criar via get

// app.get('/contato-recebido', (req,res)=>{
//     if(!ultimoContato){
//         return res.redirect('/not-found');  // se o ultimoContato for igual a nulo redireciono para not found, se não imprimo na tela os dados..
//     }
//     const {name, email} = ultimoContato;

//     res.send(`
//             <h1> Contato recebido, obrigado ${name}!</h1>
//             <p><strong>Email: ${email}</strong></p>
//         `);
// });

// //localhost:3000?nome=Bruno para fazer o post
// app.post("/", (req, res)=>{
//     const name = req.query.nome

//     res.send(`O nome passado foi ${name}`)
// })
