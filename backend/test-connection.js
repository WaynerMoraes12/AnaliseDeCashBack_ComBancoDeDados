const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    server: 'localhost',
    database: 'MeliuzDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    authentication: {
        type: 'default'
    }
};

app.get('/', (req, res) => {
    res.send('Servidor backend rodando!');
});

app.get('/dados', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT 
                Mes as month,
                Parceiro as partner,
                Receita as revenue,
                Transacoes as transactions,
                NovosUsuarios as newUsers,
                Comissao as commission
            FROM dbo.Performance
        `;
        res.json(result.recordset);
        sql.close();
    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('Servidor em http://localhost:5000'));