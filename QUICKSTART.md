# 🚀 Guia Rápido de Início

## Instalação e Execução em 3 Passos

### 1️⃣ Instalar dependências
```bash
npm install
```

### 2️⃣ Rodar em modo desenvolvimento
```bash
npm run dev
```

### 3️⃣ Abrir no navegador
Acesse: `http://localhost:5173`

---

## 📦 Scripts Disponíveis

```bash
npm run dev      # Modo desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Verificar código
```

---

## ⚡ Dicas Rápidas

### Problema: Erro ao conectar com Supabase
- Verifique sua conexão com a internet
- Confirme que as credenciais estão corretas em `src/lib/supabase.ts`

### Problema: Página em branco
- Abra o console do navegador (F12) e verifique erros
- Certifique-se que as tabelas `rf_servidores` e `rf_niveis` existem no Supabase

### Melhorar Performance
- Feche outras abas do navegador
- Use um navegador moderno (Chrome, Firefox, Edge)

---

## 📊 Dados do Projeto

- **Total de Servidores:** 213
- **Tabelas Supabase:** `rf_servidores`, `rf_niveis`
- **KPIs Principais:** 6 cards de métricas
- **Gráficos:** 6 visualizações diferentes
- **Tabelas Interativas:** 2 (servidores + níveis)

---

## 🆘 Suporte

Problemas? Verifique:
1. Node.js versão 16+ instalado: `node --version`
2. Dependências instaladas: verificar pasta `node_modules/`
3. Console do navegador para erros

---

**Bom trabalho! 🎉**
