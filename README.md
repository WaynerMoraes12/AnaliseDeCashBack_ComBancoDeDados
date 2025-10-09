# 📊 Sistema de Análise de Cashback Méliuz

## 📋 Sobre o Projeto

Este sistema foi desenvolvido como parte de um case técnico para análise de performance da linha de negócios de E-Commerce do Méliuz, a maior plataforma de cashback do Brasil.

### 🎯 Objetivo

Analisar a queda de performance da linha de negócios do E-Commerce através de:
- Visualização de dados em dashboards interativos
- Análise de KPIs (receita, transações, novos usuários, comissão)
- Identificação de problemas e oportunidades de melhoria
- Proposição de planos de ação para otimização de resultados

### 🏢 Contexto do Negócio

O Méliuz opera com um modelo de cashback onde:
- Gera vendas para lojas parceiras no e-commerce
- Recebe comissão por cada venda gerada
- Divide a comissão entre Méliuz e comprador (cashback)
- Possui mais de 40 milhões de usuários cadastrados
- Movimenta mais de 4 bilhões de reais anualmente

---

## 🏗️ Arquitetura do Sistema

O projeto é dividido em três camadas:

### 1. **Backend** (Node.js + Express)
- API RESTful que serve os dados
- Conexão com SQL Server
- Endpoint principal: `/dados`

### 2. **Frontend** (React)
- Dashboard interativo com gráficos
- Visualização de métricas de performance
- Interface responsiva

### 3. **Banco de Dados** (SQL Server)
- Armazena dados de performance
- Tabela principal: `performance`

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **MSSQL**: Driver para SQL Server
- **CORS**: Habilitação de requisições cross-origin

### Frontend
- **React**: Biblioteca para construção de interfaces
- **Recharts**: Biblioteca para gráficos e visualizações
- **Lucide React**: Ícones modernos

### Banco de Dados
- **Microsoft SQL Server**: Sistema de gerenciamento de banco de dados

---

## 📦 Estrutura do Projeto

```
AnaliseDeCashBack_ComBancoDeDados/
│
├── backend/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── meliuz-dashboard/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── base_de_dados_meliuz_case.xlsx (ou .sql)
└── README.md
```

---

## 🚀 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

1. **Node.js** (versão 14 ou superior)
   - Download: https://nodejs.org/

2. **SQL Server** (Express ou superior)
   - Download: https://www.microsoft.com/sql-server/sql-server-downloads

3. **Git** (opcional, para clonar o repositório)
   - Download: https://git-scm.com/

---

## ⚙️ Configuração do Ambiente

### 1. Clone o Repositório

```bash
git clone https://github.com/WaynerMoraes12/AnaliseDeCashBack_ComBancoDeDados.git
cd AnaliseDeCashBack_ComBancoDeDados
```

### 2. Configure o Banco de Dados

#### 2.1. Crie o Banco de Dados

Abra o SQL Server Management Studio (SSMS) e execute:

```sql
CREATE DATABASE MeliuzDB;
GO

USE MeliuzDB;
GO
```

#### 2.2. Crie a Tabela

```sql
CREATE TABLE performance (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Mes NVARCHAR(50),
    Parceiro NVARCHAR(100),
    Receita DECIMAL(18,2),
    Transacoes INT,
    NovosUsuarios INT,
    Comissao DECIMAL(18,2)
);
GO
```

#### 2.3. Insira Dados de Exemplo

```sql
INSERT INTO performance (Mes, Parceiro, Receita, Transacoes, NovosUsuarios, Comissao)
VALUES 
    ('Janeiro', 'Parceiro A', 150000.00, 1200, 350, 15000.00),
    ('Janeiro', 'Parceiro B', 200000.00, 1500, 420, 20000.00),
    ('Fevereiro', 'Parceiro A', 140000.00, 1100, 320, 14000.00),
    ('Fevereiro', 'Parceiro B', 180000.00, 1400, 380, 18000.00),
    ('Março', 'Parceiro A', 130000.00, 1000, 300, 13000.00),
    ('Março', 'Parceiro B', 170000.00, 1300, 360, 17000.00);
GO
```

### 3. Configure o Backend

#### 3.1. Acesse a pasta do backend

```bash
cd backend
```

#### 3.2. Instale as dependências

```bash
npm install
```

#### 3.3. Configure a conexão com o banco

Abra o arquivo `server.js` e ajuste as credenciais:

```javascript
const config = {
    server: 'SEU_SERVIDOR',        // Ex: 'localhost' ou 'NOME_DO_PC'
    database: 'MeliuzDB',
    user: 'SEU_USUARIO',           // Ex: 'sa'
    password: 'SUA_SENHA',
    options: {
        trustServerCertificate: true,
        encrypt: true 
    }
};
```

**⚠️ IMPORTANTE**: Nunca commite senhas reais no GitHub! Use variáveis de ambiente em produção.

### 4. Configure o Frontend

#### 4.1. Acesse a pasta do dashboard

```bash
cd ../meliuz-dashboard
```

#### 4.2. Instale as dependências

```bash
npm install
```

---

## ▶️ Como Executar o Sistema

### 1. Inicie o Backend

Em um terminal, na pasta `backend`:

```bash
node server.js
```

Você deve ver:
```
>>>>>> EXECUTANDO A VERSÃO MAIS RECENTE DO CÓDIGO <<<<<<
Conexão com o SQL Server bem-sucedida!
Servidor rodando em http://localhost:5000
```

### 2. Inicie o Frontend

Em outro terminal, na pasta `meliuz-dashboard`:

```bash
npm start
```

O navegador abrirá automaticamente em `http://localhost:3000`

### 3. Acesse o Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Endpoint de dados**: http://localhost:5000/dados

---

## 🔍 Funcionalidades

### Dados Disponíveis

O sistema fornece as seguintes métricas:

| Campo | Descrição |
|-------|-----------|
| **Mês** | Período de análise |
| **Parceiro** | Nome da loja parceira |
| **Receita** | Valor total de vendas geradas |
| **Transações** | Quantidade de compras realizadas |
| **Novos Usuários** | Número de novos cadastros |
| **Comissão** | Valor de comissão recebida |

### Análises Possíveis

- Evolução mensal de receita
- Performance por parceiro
- Ticket médio (Receita / Transações)
- Custo de aquisição de usuário (CAC)
- Taxa de conversão
- Identificação de tendências e anomalias

---

## 🐛 Solução de Problemas

### Erro de Conexão com SQL Server

**Problema**: `ConnectionError: Failed to connect to localhost:1433`

**Soluções**:
1. Verifique se o SQL Server está rodando
2. Confirme se o TCP/IP está habilitado no SQL Server Configuration Manager
3. Verifique o nome correto do servidor
4. Confirme usuário e senha

### Erro de CORS

**Problema**: `Access to XMLHttpRequest blocked by CORS policy`

**Solução**: O CORS já está configurado no backend. Certifique-se de que o backend está rodando.

### Porta já em uso

**Problema**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solução**: 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 📈 Próximos Passos

Para evoluir o sistema, considere:

1. **Segurança**
   - Implementar autenticação JWT
   - Usar variáveis de ambiente (.env)
   - Validação de dados de entrada

2. **Features**
   - Filtros por período e parceiro
   - Exportação de relatórios (PDF/Excel)
   - Alertas automáticos de queda de performance
   - Comparação entre períodos

3. **Performance**
   - Cache de dados
   - Paginação de resultados
   - Otimização de queries

4. **Deploy**
   - Dockerização do projeto
   - Deploy em nuvem (AWS, Azure, Heroku)
   - CI/CD com GitHub Actions

---

## 📝 Observações

- Os dados utilizados são fictícios e servem apenas para o case técnico
- Este é um projeto de análise e demonstração
- Não use credenciais reais em ambientes de produção
- Sempre faça backup do banco de dados

---

## 👨‍💻 Autor

**Wayner Moraes**
- GitHub: [@WaynerMoraes12](https://github.com/WaynerMoraes12)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte de um case técnico.

---

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a seção de Solução de Problemas
2. Revise os logs do console (backend e frontend)
3. Confirme que todas as dependências foram instaladas corretamente

**Boa análise! 📊💰**