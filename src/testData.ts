// Dados de teste mockados baseados no JSON fornecido para o módulo de aposentadoria
export const mockRetirementData = {
  "meta": {
    "session_id": "test-session-123",
    "created_at": "2025-01-27T00:00:00Z",
    "updated_at": "2025-01-27T00:00:00Z"
  },
  "cliente": {
    "nome": "João Silva",
    "idade": 40,
    "estadoCivil": "Casado",
    "regimeCasamento": "Comunhão Parcial",
    "residencia": "São Paulo",
    "codigo_xp": "XP123456",
    "email": "joao.silva@email.com"
  },
  "financas": {
    "composicao_patrimonial": {
      "Imóveis": 1000000,
      "Investimentos": 5000000
    },
    "resumo": {
      "patrimonio_liquido": 6000000,
      "excedente_mensal": 15000,
      "despesas_mensais": 8000
    },
    "indicadores": {
      "investimento_internacional": {
        "tem": false,
        "valor": 0,
        "percentual_sobre_ativos": 0,
        "percentual_sobre_patrimonio": 0,
        "fontes": []
      },
      "investimentos_de_curto_prazo": {
        "valor": 0,
        "percentual_sobre_ativos": 0,
        "percentual_sobre_patrimonio": 0,
        "fontes": []
      }
    },
    "rendas": [
      { 
        "fonte": "INSS", 
        "valor": 6000, 
        "tributacao": "Tributável", 
        "renda_passiva": true,
        "descricao": "Aposentadoria INSS"
      }
    ],
    "despesas": [
      { "descricao": "Moradia", "valor": 3000 },
      { "descricao": "Alimentação", "valor": 2000 },
      { "descricao": "Transporte", "valor": 1000 },
      { "descricao": "Saúde", "valor": 1000 },
      { "descricao": "Lazer", "valor": 1000 }
    ]
  },
  "ativos": [
    {
      "tipo": "Investimentos",
      "classe": "Financeiros",
      "valor": 5000000,
      "subitens": [
        { "classe": "Previdência PGBL", "valor": 5000000 }
      ]
    },
    { 
      "tipo": "Imóveis", 
      "classe": "Residencial", 
      "valor": 1000000 
    }
  ],
  "composicao_patrimonial": {
    "Investimentos": 5000000,
    "Imóveis": 1000000
  },
  "passivos": [],
  "objetivos": [
    {
      "tipo": "Aposentadoria",
      "valor": 50000,
      "prazo": "aos 65 anos",
      "prioridade": "Alta",
      "nao_aposentadoria": false
    }
  ],
  "planoAposentadoria": {
    "idade_atual": 40,
    "idade_aposentadoria": 65,
    "expectativa_vida": 100,
    "renda_desejada": 50000,
    "capital_necessario": 15000000,
    "cenarios": [
      {
        "idade_aposentadoria": 65,
        "aporte_mensal": 15000,
        "capital_necessario": 15000000
      },
      {
        "idade_aposentadoria": 60,
        "aporte_mensal": 25000,
        "capital_necessario": 18000000
      }
    ],
    "estrategias": [
      { 
        "tipo": "Venda de imóvel", 
        "valor": 1000000, 
        "descricao": "Venda planejada do imóvel residencial em 5 anos para reforçar investimentos" 
      },
      { 
        "tipo": "Previdência privada", 
        "valor": 5000000, 
        "descricao": "PGBL sob regime progressivo com contribuições regulares" 
      },
      { 
        "tipo": "Aportes mensais", 
        "valor": 15000, 
        "descricao": "Aporte mensal do excedente atual para acelerar acumulação" 
      }
    ],
    "riscosIdentificados": [
      "Inflação elevada pode corroer o poder de compra da renda desejada",
      "Ausência de aportes adicionais pode comprometer o objetivo",
      "Risco de longevidade - expectativa de vida pode ser maior que 100 anos",
      "Volatilidade dos mercados pode impactar o patrimônio acumulado"
    ],
    "recomendacoes": [
      { 
        "tipo": "Definir meta de alocação", 
        "descricao": "Estabelecer estratégia de risco adequada para acumulação e renda, considerando perfil conservador" 
      },
      { 
        "tipo": "Introduzir aportes", 
        "descricao": "Planejar aportes mensais ou anuais mesmo que modestos para acelerar o crescimento do patrimônio" 
      },
      { 
        "tipo": "Revisar previdência", 
        "descricao": "Avaliar aumento de contribuições e otimização fiscal através de deduções no IR" 
      },
      { 
        "tipo": "Diversificação", 
        "descricao": "Considerar diversificação internacional para reduzir risco país" 
      }
    ]
  },
  "previdencia_privada": [
    {
      "tipo": "PGBL",
      "saldo_atual": 5000000,
      "contribuicao_mensal": 0,
      "descricao": "Plano de Benefício Livre - Regime Progressivo"
    },
    {
      "tipo": "VGBL",
      "saldo_atual": 0,
      "contribuicao_mensal": 0,
      "descricao": "Vida Gerador de Benefício Livre - Regime Regressivo"
    }
  ],
  "dados_extras": {
    "coletados_em": "2025-01-27"
  }
};

// Função para simular dados da API
export const getMockUserReports = () => {
  return mockRetirementData;
};

// Função para simular delay da API
export const simulateApiDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


