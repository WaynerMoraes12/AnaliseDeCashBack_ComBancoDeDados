import React, { useMemo, useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, AlertCircle, DollarSign, Users, ShoppingCart } from 'lucide-react';

const MeliuzAnalysis = () => {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/dados')
      .then(res => res.json())
      .then(data => setRawData(data))
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, []);

  const kpis = useMemo(() => {
    if (!rawData.length) return { revenueChange: 0, transactionsChange: 0, newUsersChange: 0 };

    const agostoData = rawData.filter(d => d.month === 'Agosto');
    const setembroData = rawData.filter(d => d.month === 'Setembro');

    const sumData = (data) => data.reduce((acc, curr) => ({
      revenue: acc.revenue + curr.revenue,
      transactions: acc.transactions + curr.transactions,
      newUsers: acc.newUsers + curr.newUsers,
      commission: acc.commission + curr.commission
    }), { revenue: 0, transactions: 0, newUsers: 0, commission: 0 });

    const agostoTotal = sumData(agostoData);
    const setembroTotal = sumData(setembroData);

    return {
      revenueChange: ((setembroTotal.revenue - agostoTotal.revenue) / agostoTotal.revenue * 100).toFixed(1),
      transactionsChange: ((setembroTotal.transactions - agostoTotal.transactions) / agostoTotal.transactions * 100).toFixed(1),
      newUsersChange: ((setembroTotal.newUsers - agostoTotal.newUsers) / agostoTotal.newUsers * 100).toFixed(1),
      agostoTotal,
      setembroTotal
    };
  }, [rawData]);

  const monthlyData = useMemo(() => {
    if (!rawData.length) return [];
    
    const grouped = rawData.reduce((acc, d) => {
      if (!acc[d.month]) {
        acc[d.month] = { month: d.month, receita: 0, transacoes: 0, novosUsuarios: 0 };
      }
      acc[d.month].receita += d.revenue;
      acc[d.month].transacoes += d.transactions;
      acc[d.month].novosUsuarios += d.newUsers;
      return acc;
    }, {});
    
    return Object.values(grouped);
  }, [rawData]);

  const partnerData = useMemo(() => {
    if (!rawData.length) return [];
    
    const partners = {};
    rawData.forEach(d => {
      if (!partners[d.partner]) {
        partners[d.partner] = { name: `Parceiro ${d.partner}`, agosto: 0, setembro: 0 };
      }
      if (d.month === 'Agosto') partners[d.partner].agosto += d.revenue;
      if (d.month === 'Setembro') partners[d.partner].setembro += d.revenue;
    });
    
    return Object.values(partners);
  }, [rawData]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* BLOCO: Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Dashboard de Performance - E-Commerce Méliuz</h1>
          <p className="text-gray-600 text-center text-lg">Análise Agosto vs Setembro 2025</p>
        </div>

        {/* BLOCO: Alert de Queda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-3 mr-4">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Queda Crítica Detectada</h3>
                <p className="text-lg">Receita caiu {Math.abs(kpis.revenueChange)}% em Setembro. Necessária ação imediata.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO: KPI Cards */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Indicadores de Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card Receita */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white rounded-full p-3">
                    <DollarSign className="text-green-500" size={28} />
                  </div>
                  <TrendingDown className="text-white" size={28} />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Receita</h3>
                <p className="text-white text-4xl font-bold mb-2">
                  R$ {(kpis.setembroTotal?.revenue || 0).toLocaleString('pt-BR')}
                </p>
                <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 inline-block">
                  <p className="text-white text-sm font-semibold">↓ {Math.abs(kpis.revenueChange)}% vs Agosto</p>
                </div>
              </div>
            </div>

            {/* Card Transações */}
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white rounded-full p-3">
                    <ShoppingCart className="text-blue-500" size={28} />
                  </div>
                  <TrendingDown className="text-white" size={28} />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Transações</h3>
                <p className="text-white text-4xl font-bold mb-2">
                  {kpis.setembroTotal?.transactions || 0}
                </p>
                <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 inline-block">
                  <p className="text-white text-sm font-semibold">↓ {Math.abs(kpis.transactionsChange)}% vs Agosto</p>
                </div>
              </div>
            </div>

            {/* Card Novos Usuários */}
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white rounded-full p-3">
                    <Users className="text-purple-500" size={28} />
                  </div>
                  <TrendingDown className="text-white" size={28} />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Novos Usuários</h3>
                <p className="text-white text-4xl font-bold mb-2">
                  {kpis.setembroTotal?.newUsers || 0}
                </p>
                <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 inline-block">
                  <p className="text-white text-sm font-semibold">↓ {Math.abs(kpis.newUsersChange)}% vs Agosto</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BLOCO: Gráficos */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Análise Visual</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Evolução da Receita</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="receita" fill="#3b82f6" name="Receita (R$)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Transações por Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="transacoes" stroke="#10b981" strokeWidth={3} name="Transações" dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="novosUsuarios" stroke="#f59e0b" strokeWidth={3} name="Novos Usuários" dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BLOCO: Performance por Parceiro */}
        {partnerData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Performance por Parceiro</h2>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={partnerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="agosto" fill="#3b82f6" name="Agosto" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="setembro" fill="#ef4444" name="Setembro" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* BLOCO: Diagnóstico */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Diagnóstico - Causa Raiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 shadow">
              <div className="text-center mb-4">
                <div className="inline-block bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mb-3">1</div>
              </div>
              <h4 className="font-bold text-red-900 text-lg mb-2 text-center">Queda de Novos Usuários</h4>
              <p className="text-red-800 text-sm text-center">Redução de {Math.abs(kpis.newUsersChange)}% na aquisição é o principal fator de impacto.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 shadow">
              <div className="text-center mb-4">
                <div className="inline-block bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mb-3">2</div>
              </div>
              <h4 className="font-bold text-orange-900 text-lg mb-2 text-center">Problema Sistêmico</h4>
              <p className="text-orange-800 text-sm text-center">Todos os parceiros afetados - indica falha estrutural na estratégia.</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-200 shadow">
              <div className="text-center mb-4">
                <div className="inline-block bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mb-3">3</div>
              </div>
              <h4 className="font-bold text-yellow-900 text-lg mb-2 text-center">Ticket Médio Estável</h4>
              <p className="text-yellow-800 text-sm text-center">Problema no VOLUME de transações, não no valor médio.</p>
            </div>
          </div>
        </div>

        {/* BLOCO: Plano de Ação */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Plano de Ação Imediato</h2>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/15 backdrop-blur rounded-xl p-6 shadow-lg">
                <h4 className="font-bold text-xl mb-4">1. Marketing & Aquisição</h4>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2">•</span><span>Revisar campanhas de mídia paga</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Aumentar investimento em performance</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Reativar campanhas de referral</span></li>
                </ul>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl p-6 shadow-lg">
                <h4 className="font-bold text-xl mb-4">2. Retenção & Engajamento</h4>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2">•</span><span>Push notifications personalizadas</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Cashback bônus para reativação</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Email marketing segmentado</span></li>
                </ul>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl p-6 shadow-lg">
                <h4 className="font-bold text-xl mb-4">3. Parceiros</h4>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2">•</span><span>Negociar comissões atrativas</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Campanhas exclusivas por parceiro</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Revisar mix de produtos</span></li>
                </ul>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl p-6 shadow-lg">
                <h4 className="font-bold text-xl mb-4">4. Monitoramento</h4>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2">•</span><span>Dashboard diário de usuários</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Alertas automáticos de queda</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>A/B tests em landing pages</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MeliuzAnalysis;