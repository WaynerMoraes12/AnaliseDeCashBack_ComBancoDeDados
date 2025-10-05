const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do SQL Server
const config = {
    user: 'meliuz_user', // ou deixe vazio se usar Windows Authentication
    password: 'Meliuz@123', // ou deixe vazio
    server: 'localhost', // ou o nome que funcionou no SSMS
    database: 'MeliuzDB',
    options: {
        encrypt: false, // Desabilita SSL
        trustServerCertificate: true
    }
};

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor backend rodando!');
});

// Rota para buscar dados do SQL Server
app.get('/dados', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT 
                MONTH(Data) as month,
                Parceiro as partner,
                SUM(ValorCompra) as revenue,
                COUNT(*) as transactions,
                SUM(CASE WHEN NovoUsuario = 1 THEN 1 ELSE 0 END) as newUsers,
                SUM(Comissao) as commission
            FROM Transacoes
            GROUP BY MONTH(Data), Parceiro
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.listen(5000, () => console.log('Servidor rodando em http://localhost:5000'));