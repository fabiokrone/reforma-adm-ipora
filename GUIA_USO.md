# 📖 Guia de Uso - Dashboard Interativo

## Para Gestores Municipais de Iporã do Oeste/SC

---

## 🎯 Objetivo do Dashboard

Este dashboard foi desenvolvido para facilitar a visualização e análise do plano de cargos e salários do município, permitindo que você:
- Veja dados de todos os 213 servidores municipais
- Entenda a estrutura completa das tabelas salariais
- Localize rapidamente a posição de qualquer servidor na tabela
- Compare informações e tome decisões baseadas em dados

---

## 🚀 Como Usar

### 1. Navegação Básica

#### Menu Principal (Tabs)
No topo da página, você verá duas abas:

```
┌──────────────────────────────┐
│ 📊 ANTES  │  🔄 DEPOIS       │
└──────────────────────────────┘
```

- **📊 ANTES:** Situação atual do município (dados reais dos 213 servidores)
- **🔄 DEPOIS:** Futura estrutura após a reforma (em desenvolvimento)

**💡 Dica:** Clique nas abas para alternar entre as visualizações.

---

### 2. Entendendo os KPIs (Cards no Topo)

Logo abaixo do menu, você verá 6 cards coloridos com informações importantes:

| Card | O que significa |
|------|----------------|
| **Total de Servidores** | Quantos funcionários o município possui |
| **Massa Salarial Total** | Quanto o município gasta por mês com salários |
| **Salário Médio** | Média salarial dos servidores |
| **Total de Níveis** | Quantos níveis salariais diferentes existem |
| **Menor Salário** | O menor valor pago |
| **Maior Salário** | O maior valor pago |

---

### 3. Analisando os Gráficos

#### 6 Gráficos Disponíveis:

**🔵 Gráfico 1: Distribuição por Nível**
- Mostra quantos servidores existem em cada nível
- Útil para ver quais níveis têm mais pessoas

**🟢 Gráfico 2: Distribuição por Cargo**
- Pizza mostrando os 10 cargos com mais servidores
- Identifique rapidamente os cargos mais comuns

**🟡 Gráfico 3: Faixas Salariais**
- Quantos servidores ganham em cada faixa (< 2k, 2-3k, etc.)
- Visualize a distribuição de renda

**🟠 Gráfico 4: Grau × Referência**
- Distribuição da estrutura de níveis
- Entenda a complexidade do plano de cargos

**🟣 Gráfico 5: Top 10 Maiores Salários**
- Os 10 servidores com maiores salários
- Transparência na remuneração

**🔴 Gráfico 6: Massa Salarial por Cargo**
- Quais cargos custam mais para o município
- Análise de impacto financeiro por função

---

### 4. Lista de Servidores (A Tabela Mágica! ✨)

Esta é a funcionalidade mais poderosa do dashboard!

#### Como usar:

**🔍 Buscar um Servidor:**
1. Encontre a caixa de busca com ícone de lupa
2. Digite o nome (ou parte dele)
3. A lista filtra automaticamente

**🎯 Filtrar por Cargo:**
1. Use o menu dropdown "Todos os cargos"
2. Selecione o cargo desejado
3. Veja apenas servidores daquela função

**⬆️⬇️ Ordenar a Lista:**
- Clique no nome da coluna (Nome, Cargo, Nível, Salário)
- A seta indica a ordem (crescente ⬆️ ou decrescente ⬇️)
- Clique novamente para inverter

**🎪 VER POSIÇÃO NA TABELA SALARIAL (Recurso Especial!):**

👉 **CLIQUE EM QUALQUER SERVIDOR DA LISTA**

O que acontece:
1. A linha do servidor fica verde (você selecionou!)
2. A página rola automaticamente para baixo
3. A tabela salarial correta se abre
4. A célula exata onde ele está fica destacada com ⭐
5. Você vê: GRAU, REFERÊNCIA e SALÁRIO

**Exemplo prático:**

```
Você clica em: ROBERTO RUANI
Sistema mostra: TEC59A - Grau III - Referência G
Salário: R$ 7.334,49
```

💡 **Para voltar ao normal:** Clique no botão "X" na barra verde ou clique em outro servidor.

---

### 5. Tabelas Salariais Completas

Role até a seção "Tabelas Salariais Detalhadas"

#### O que você vê:

Cards organizados por categoria, como:
- 🛡️ Segurança
- ⚕️ Saúde
- 💼 Técnico
- etc.

#### Como usar:

**Expandir uma Categoria:**
1. Clique no card da categoria (ex: "⚕️ Saúde")
2. Todas as tabelas daquela categoria aparecem

**Entender uma Tabela:**

```
═══════════════════════════════════════
NÍVEL TEC59A (Técnico)
═══════════════════════════════════════
GRAU │    A        B        C    ...
─────┼───────────────────────────────
  I  │ R$ 5.200  R$ 5.400  R$ 5.600
 II  │ R$ 5.500  R$ 5.700  R$ 5.900
III  │ R$ 5.800  R$ 6.000  R$ 6.200
 IV  │ R$ 6.100  R$ 6.300  R$ 6.500
```

- **GRAU:** I, II, III, IV (evolução vertical)
- **REFERÊNCIA:** A, B, C, D, E... (evolução horizontal)
- **Cada célula:** Salário para aquela posição

**Cores nas células:**
- 🟢 Verde claro: < R$ 2.000
- 🔵 Azul claro: R$ 2.000 - R$ 4.000
- 🟡 Amarelo claro: R$ 4.000 - R$ 6.000
- 🟠 Laranja claro: R$ 6.000 - R$ 8.000
- 🔴 Vermelho claro: > R$ 8.000

---

## 💡 Casos de Uso Práticos

### Caso 1: "Preciso saber quanto ganha um servidor específico"

1. Use a busca na Lista de Servidores
2. Digite o nome
3. Veja o salário na coluna da direita

**Tempo:** 5 segundos ⚡

---

### Caso 2: "Quero ver a posição do servidor na tabela salarial"

1. Encontre o servidor na lista
2. **Clique na linha dele**
3. Veja a posição exata destacada com ⭐

**Tempo:** 10 segundos ⚡

---

### Caso 3: "Quantos professores temos e quanto eles custam?"

1. No gráfico "Distribuição por Cargo", localize "Professor"
2. Veja a quantidade no gráfico
3. No gráfico "Massa Salarial por Cargo", veja o custo total

**Tempo:** 15 segundos ⚡

---

### Caso 4: "Quais são todos os níveis da área de Saúde?"

1. Role até "Tabelas Salariais Detalhadas"
2. Clique em "⚕️ Saúde"
3. Visualize todas as tabelas da categoria

**Tempo:** 10 segundos ⚡

---

### Caso 5: "Quantos servidores ganham mais de R$ 5.000?"

1. Veja o gráfico "Faixas Salariais"
2. Some as barras: "R$ 5k - 7k" + "R$ 7k - 10k" + "> R$ 10k"

**Tempo:** 10 segundos ⚡

---

## 🎨 Entendendo as Cores

### Cores dos Ícones nos Cards KPI:
- 🔵 Azul: Informações gerais (Total de servidores)
- 🟢 Verde: Valores financeiros (Massa salarial)
- 🟣 Roxo: Médias (Salário médio)
- 🟠 Laranja: Contadores (Total de níveis)
- 🔴 Vermelho: Mínimo (Menor salário)
- 🟢 Verde escuro: Máximo (Maior salário)

### Cores de Destaque:
- 🟢 Verde: Servidor selecionado
- ⭐ Amarelo: Estrela na posição exata
- 🔵 Azul: Padrão para níveis não selecionados

---

## ⚠️ Dicas Importantes

### ✅ FAÇA:
- Explore livremente! Você não vai quebrar nada
- Use os filtros para análises específicas
- Clique nos servidores para ver suas posições
- Compare informações entre gráficos

### ❌ NÃO FAÇA:
- Não tente editar valores (é apenas visualização)
- Não compartilhe credenciais do sistema
- Não use em navegadores muito antigos (Internet Explorer)

---

## 🔧 Problemas Comuns

**❓ "Não encontrei um servidor na busca"**
- Verifique a ortografia do nome
- Tente buscar apenas parte do nome (ex: "ROBERTO" ao invés de "ROBERTO RUANI")
- Remova filtros de cargo ativos

**❓ "O destaque não funciona quando clico"**
- Aguarde 1 segundo para o sistema processar
- Role um pouco para baixo manualmente
- Tente clicar novamente

**❓ "A página está lenta"**
- Feche outras abas do navegador
- Atualize a página (F5)
- Use Chrome, Firefox ou Edge (navegadores modernos)

**❓ "Erro ao carregar dados"**
- Verifique sua conexão com a internet
- Clique em "Tentar Novamente"
- Aguarde alguns segundos

---

## 📱 Usando no Celular/Tablet

- O dashboard funciona em dispositivos móveis
- Algumas tabelas podem ter scroll horizontal (deslize com o dedo)
- Recomendamos usar no **modo paisagem** (celular deitado)
- Melhor experiência: tablet ou computador

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Leia este guia completamente
2. Tente resolver com as dicas acima
3. Entre em contato com o setor de TI da prefeitura

---

## 🎓 Glossário

**Dashboard:** Painel visual com informações importantes
**KPI:** Indicador chave de performance (métricas importantes)
**Pivot:** Tabela cruzada (linhas × colunas)
**Grau:** Nível vertical na tabela salarial (I, II, III, IV)
**Referência:** Nível horizontal na tabela salarial (A, B, C...)
**Massa Salarial:** Total de gastos com salários
**Filtro:** Ferramenta para mostrar apenas dados específicos

---

**📅 Última atualização:** Janeiro 2026
**👨‍💻 Desenvolvido para:** Prefeitura Municipal de Iporã do Oeste - SC
**📄 Versão:** 2.0 - Sistema Interativo

---

**💚 Use e abuse do dashboard! Ele foi feito para facilitar sua vida! 💚**
