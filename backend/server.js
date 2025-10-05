const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    server: 'WAYNERMORAES',
    database: 'MeliuzDB',
    user: 'sa', 
    password: 'NovaSenhaSuperForte123',
    
    options: {
        trustServerCertificate: true,
        encrypt: true 
    }
};
console.log(">>>>>> EXECUTANDO A VERSÃO MAIS RECENTE DO CÓDIGO <<<<<<"); 
sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Conexão com o SQL Server bem-sucedida!');
    }

    app.get('/', (req, res) => {
        res.send('Servidor backend rodando!');
    });

 app.get('/dados', async (req, res) => {
    try {
        
        const result = await sql.query`
            SELECT 
                Mes as month,
                Parceiro as partner,
                Receita as revenue,
                Transacoes as transactions,
                NovosUsuarios as newUsers,
                Comissao as commission
            FROM 
                performance
        `;
        res.json(result.recordset);

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ error: 'Erro ao buscar dados do servidor' });
    }
});
    app.listen(5000, () => console.log('Servidor rodando em http://localhost:5000'));

}).catch(err => {
    console.error('Erro ao conectar ao SQL Server:', err);
});
