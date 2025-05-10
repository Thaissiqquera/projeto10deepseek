from http.server import BaseHTTPRequestHandler
import json
import numpy as np
import pandas as pd
from io import StringIO

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Gerar dados fictícios para clientes
        np.random.seed(42)
        num_clientes = 100
        
        # Dados fictícios
        clientes = pd.DataFrame({
            'cliente_id': range(1, num_clientes+1),
            'frequencia_compras': np.random.randint(1, 20, size=num_clientes),
            'total_gasto': np.random.randint(100, 10000, size=num_clientes),
            'ultima_compra': np.random.randint(1, 365, size=num_clientes),
            'idade': np.random.randint(18, 70, size=num_clientes),
            'renda_mensal': np.random.randint(2000, 20000, size=num_clientes)
        })
        
        # Clusterização (simplificada)
        clientes['cluster'] = np.where(
            (clientes['frequencia_compras'] > 12) & (clientes['total_gasto'] > 5000),
            0,  # Cliente fiel e de alto valor
            np.where(
                clientes['ultima_compra'] > 250,
                1,  # Cliente inativo
                2   # Cliente de valor médio
            )
        )
        
        # Dados para gráficos
        cluster_data = clientes.groupby('cluster').agg({
            'frequencia_compras': 'mean',
            'total_gasto': 'mean',
            'ultima_compra': 'mean'
        }).reset_index().to_dict('records')
        
        # Dados de campanhas fictícias
        campanhas = [
            {'nome': 'Natal 2023', 'roi': 4.5, 'gasto_medio': 1200},
            {'nome': 'Black Friday', 'roi': 6.2, 'gasto_medio': 1800},
            {'nome': 'Dia das Mães', 'roi': 3.8, 'gasto_medio': 950},
            {'nome': 'Aniversário', 'roi': 5.1, 'gasto_medio': 1500}
        ]
        
        # Clientes de alto valor
        threshold = clientes['total_gasto'].quantile(0.75)
        alto_valor = clientes[clientes['total_gasto'] >= threshold].to_dict('records')
        
        # Preparar resposta
        response = {
            'clientes': clientes.to_dict('records'),
            'cluster_data': cluster_data,
            'campanhas': campanhas,
            'alto_valor': alto_valor,
            'clv_stats': {
                'media': clientes['total_gasto'].mean(),
                'mediana': clientes['total_gasto'].median(),
                'top_25': threshold
            }
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))