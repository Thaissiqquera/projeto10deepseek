function initializeCharts() {
    const data = window.marketingData;
    
    // Gráfico de Clusters
    const clusterCounts = {
        0: data.clientes.filter(c => c.cluster === 0).length,
        1: data.clientes.filter(c => c.cluster === 1).length,
        2: data.clientes.filter(c => c.cluster === 2).length
    };
    
    new Chart(
        document.getElementById('clusterChart'),
        {
            type: 'doughnut',
            data: {
                labels: ['Alto Valor', 'Inativos', 'Valor Médio'],
                datasets: [{
                    data: [clusterCounts[0], clusterCounts[1], clusterCounts[2]],
                    backgroundColor: [
                        '#4e79a7',
                        '#e15759',
                        '#f28e2b'
                    ]
                }]
            }
        }
    );
    
    // Atualizar informações dos clusters
    const clusterInfo = document.getElementById('clusterInfo');
    data.cluster_data.forEach(cluster => {
        const div = document.createElement('div');
        div.className = 'cluster-info';
        div.innerHTML = `
            <h3>Cluster ${cluster.cluster} - ${getClusterName(cluster.cluster)}</h3>
            <p>Frequência média de compras: ${cluster.frequencia_compras.toFixed(1)}</p>
            <p>Gasto total médio: R$${cluster.total_gasto.toFixed(2)}</p>
            <p>Dias desde última compra: ${cluster.ultima_compra.toFixed(1)}</p>
        `;
        clusterInfo.appendChild(div);
    });
    
    // Gráficos de Campanhas
    new Chart(
        document.getElementById('roiChart'),
        {
            type: 'bar',
            data: {
                labels: data.campanhas.map(c => c.nome),
                datasets: [{
                    label: 'ROI (Retorno sobre Investimento)',
                    data: data.campanhas.map(c => c.roi),
                    backgroundColor: '#59a14f'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    
    new Chart(
        document.getElementById('spendingChart'),
        {
            type: 'bar',
            data: {
                labels: data.campanhas.map(c => c.nome),
                datasets: [{
                    label: 'Gasto Médio por Cliente (R$)',
                    data: data.campanhas.map(c => c.gasto_medio),
                    backgroundColor: '#edc948'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    
    // Gráfico de CLV
    const clvData = data.clientes.map(c => c.total_gasto);
    new Chart(
        document.getElementById('clvChart'),
        {
            type: 'histogram',
            data: {
                datasets: [{
                    label: 'Distribuição de CLV',
                    data: clvData,
                    backgroundColor: '#76b7b2'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Customer Lifetime Value (R$)'
                        }
                    }
                }
            }
        }
    );
    
    // Informações de alto valor
    const highValueInfo = document.getElementById('highValueInfo');
    highValueInfo.innerHTML = `
        <div class="cluster-info">
            <h3>Clientes de Alto Valor</h3>
            <p>Total de clientes: ${data.alto_valor.length}</p>
            <p>Gasto médio: R$${data.clv_stats.media.toFixed(2)}</p>
            <p>Limite para alto valor: R$${data.clv_stats.top_25.toFixed(2)}</p>
        </div>
    `;
}

function getClusterName(clusterId) {
    switch(clusterId) {
        case 0: return 'Clientes Fiéis e de Alto Valor';
        case 1: return 'Clientes Inativos';
        case 2: return 'Clientes de Valor Médio';
        default: return 'Desconhecido';
    }
}

function updateRecommendations() {
    const data = window.marketingData;
    const recommendations = [
        "Priorizar campanhas com ROI elevado, como aquelas que entregaram maior retorno por real investido.",
        "Reavaliar ou reformular campanhas com ROI baixo, focando em novos formatos ou incentivos como brindes, frete grátis, etc.",
        "Investir mais em campanhas com alto gasto médio por cliente, pois indicam maior valor percebido.",
        "Criar estratégias específicas para reativar clientes inativos, como ofertas personalizadas.",
        "Desenvolver programas de fidelidade para clientes de alto valor com benefícios exclusivos."
    ];
    
    const list = document.getElementById('recommendationsList');
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        list.appendChild(li);
    });
}