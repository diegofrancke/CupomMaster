# Guia de Deploy - CupomMaster na Azure

Este guia detalha o processo completo para fazer deploy do CupomMaster na Microsoft Azure.

## 📋 Pré-requisitos

- Conta Azure ativa
- Azure CLI instalado ([Download](https://learn.microsoft.com/cli/azure/install-azure-cli))
- .NET 10.0 SDK instalado
- Node.js 18+ instalado

## 🏗️ Arquitetura na Azure

```
┌─────────────────────────────────────────────────────────────┐
│                    Azure Static Web Apps                     │
│                   (Frontend - Angular)                       │
│              https://cupommaster.azurestaticapps.net        │
└────────────────────────┬────────────────────────────────────┘
                        │ HTTPS/JSON + JWT
┌────────────────────────▼────────────────────────────────────┐
│                    Azure App Service                         │
│                   (Backend - ASP.NET Core)                   │
│              https://cupommaster-api.azurewebsites.net      │
└────────────────────────┬────────────────────────────────────┘
                        │ SQL Connection
┌────────────────────────▼────────────────────────────────────┐
│                   Azure SQL Database                         │
│                  cupommaster-db.database.windows.net        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Passo 1: Login no Azure CLI

```bash
# Login na Azure
az login

# Verificar assinatura ativa
az account show

# (Opcional) Definir assinatura padrão se tiver múltiplas
az account set --subscription "Nome-da-Sua-Assinatura"
```

---

## 🗄️ Passo 2: Criar Azure SQL Database

### 2.1 Criar Resource Group

```bash
# Criar resource group (escolha a região mais próxima)
az group create \
  --name rg-cupommaster \
  --location brazilsouth
```

**Regiões sugeridas:**
- `brazilsouth` - São Paulo (melhor para Brasil)
- `eastus` - Leste dos EUA (alternativa)

### 2.2 Criar SQL Server

```bash
# Criar SQL Server
az sql server create \
  --name cupommaster-sqlserver \
  --resource-group rg-cupommaster \
  --location brazilsouth \
  --admin-user sqladmin \
  --admin-password "SuaSenhaSegura123!"
```

⚠️ **IMPORTANTE:** Anote o admin-password - você precisará dele!

### 2.3 Configurar Firewall do SQL Server

```bash
# Permitir serviços do Azure
az sql server firewall-rule create \
  --resource-group rg-cupommaster \
  --server cupommaster-sqlserver \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Permitir seu IP atual (para gerenciar pelo SSMS)
az sql server firewall-rule create \
  --resource-group rg-cupommaster \
  --server cupommaster-sqlserver \
  --name AllowMyIP \
  --start-ip-address SEU_IP_AQUI \
  --end-ip-address SEU_IP_AQUI
```

Para descobrir seu IP: https://www.whatismyip.com/

### 2.4 Criar Database

```bash
# Criar database (Basic tier para começar)
az sql db create \
  --resource-group rg-cupommaster \
  --server cupommaster-sqlserver \
  --name cupommaster-db \
  --service-objective Basic \
  --backup-storage-redundancy Local
```

**Tiers disponíveis:**
- `Basic` - R$ ~15/mês (desenvolvimento/teste)
- `S0` - R$ ~45/mês (produção pequena)
- `S1` - R$ ~90/mês (produção média)

### 2.5 Obter Connection String

```bash
# Obter connection string
az sql db show-connection-string \
  --client ado.net \
  --server cupommaster-sqlserver \
  --name cupommaster-db
```

**Connection String ficará assim:**
```
Server=tcp:cupommaster-sqlserver.database.windows.net,1433;
Initial Catalog=cupommaster-db;
Persist Security Info=False;
User ID=sqladmin;
Password={SuaSenhaSegura123!};
MultipleActiveResultSets=False;
Encrypt=True;
TrustServerCertificate=False;
Connection Timeout=30;
```

---

## 🚀 Passo 3: Preparar Backend para Deploy

### 3.1 Atualizar appsettings.json

Edite `Backend/CupomMaster.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:cupommaster-sqlserver.database.windows.net,1433;Initial Catalog=cupommaster-db;Persist Security Info=False;User ID=sqladmin;Password=SuaSenhaSegura123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  },
  "JwtSettings": {
    "Secret": "SuaChaveSecretaMuitoSeguraComMaisDe32Caracteres",
    "Issuer": "CupomMaster",
    "Audience": "CupomMasterUsers",
    "ExpirationHours": 24
  },
  "AllowedOrigins": [
    "https://cupommaster.azurestaticapps.net",
    "http://localhost:4200"
  ],
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 3.2 Aplicar Migrations no Azure SQL

No diretório do backend:

```bash
cd Backend/CupomMaster.API

# Atualizar connection string temporariamente para Azure
# Edite appsettings.json com a connection string do Azure

# Aplicar migrations
dotnet ef database update

# Verificar se as tabelas foram criadas
# Use Azure Data Studio ou SSMS para conectar
```

### 3.3 Publicar Backend

```bash
# Ainda no diretório Backend/CupomMaster.API

# Build de produção
dotnet publish -c Release -o ./publish

# Criar arquivo zip para upload
Compress-Archive -Path ./publish/* -DestinationPath ./cupommaster-api.zip -Force
```

---

## 🌐 Passo 4: Criar Azure App Service (Backend)

### 4.1 Criar App Service Plan

```bash
# Criar plano (Free tier F1 ou Basic B1)
az appservice plan create \
  --name plan-cupommaster \
  --resource-group rg-cupommaster \
  --location brazilsouth \
  --sku B1 \
  --is-linux
```

**SKUs disponíveis:**
- `F1` - Grátis (limitado, sem custom domain)
- `B1` - R$ ~45/mês (recomendado)
- `S1` - R$ ~200/mês (produção)

### 4.2 Criar Web App

```bash
# Criar web app
az webapp create \
  --resource-group rg-cupommaster \
  --plan plan-cupommaster \
  --name cupommaster-api \
  --runtime "DOTNET|10.0"
```

⚠️ O nome `cupommaster-api` precisa ser único globalmente. Se estiver em uso, tente outro nome.

### 4.3 Configurar Variáveis de Ambiente

```bash
# Configurar connection string
az webapp config connection-string set \
  --resource-group rg-cupommaster \
  --name cupommaster-api \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:cupommaster-sqlserver.database.windows.net,1433;Initial Catalog=cupommaster-db;User ID=sqladmin;Password=SuaSenhaSegura123!;Encrypt=True;"

# Configurar app settings
az webapp config appsettings set \
  --resource-group rg-cupommaster \
  --name cupommaster-api \
  --settings \
    JwtSettings__Secret="SuaChaveSecretaMuitoSeguraComMaisDe32Caracteres" \
    JwtSettings__Issuer="CupomMaster" \
    JwtSettings__Audience="CupomMasterUsers" \
    JwtSettings__ExpirationHours="24" \
    ASPNETCORE_ENVIRONMENT="Production"
```

### 4.4 Deploy do Backend

```bash
# Deploy via zip
az webapp deployment source config-zip \
  --resource-group rg-cupommaster \
  --name cupommaster-api \
  --src ./cupommaster-api.zip
```

### 4.5 Verificar Backend

Acesse: `https://cupommaster-api.azurewebsites.net/swagger`

Você deverá ver a documentação Swagger da API.

---

## 🎨 Passo 5: Preparar Frontend para Deploy

### 5.1 Atualizar environment.prod.ts

Edite `Frontend/cupommaster-app/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://cupommaster-api.azurewebsites.net/api'
};
```

### 5.2 Build de Produção

```bash
cd Frontend/cupommaster-app

# Instalar dependências (se necessário)
npm install

# Build de produção
ng build --configuration production
```

Os arquivos compilados estarão em `dist/cupommaster-app/browser/`

---

## ☁️ Passo 6: Deploy do Frontend (Azure Static Web Apps)

### Opção A: Via Azure Portal (Recomendado para primeira vez)

1. Acesse o [Azure Portal](https://portal.azure.com)
2. Clique em "Create a resource"
3. Procure por "Static Web App" e clique em "Create"
4. Preencha:
   - **Resource Group:** rg-cupommaster
   - **Name:** cupommaster
   - **Region:** Brazil South
   - **Source:** GitHub
   - **GitHub Account:** Conecte sua conta
   - **Repository:** CupomMaster
   - **Branch:** main
   - **Build Presets:** Angular
   - **App location:** /Frontend/cupommaster-app
   - **Output location:** dist/cupommaster-app/browser
5. Clique em "Review + Create"

O Azure criará um workflow no GitHub Actions automaticamente!

### Opção B: Via Azure CLI

```bash
# Criar Static Web App
az staticwebapp create \
  --name cupommaster \
  --resource-group rg-cupommaster \
  --location brazilsouth \
  --source https://github.com/diegofrancke/CupomMaster \
  --branch main \
  --app-location "/Frontend/cupommaster-app" \
  --output-location "dist/cupommaster-app/browser" \
  --login-with-github
```

### 5.3 Configurar Rota da API no Static Web App

Crie o arquivo `Frontend/cupommaster-app/staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  }
}
```

Commit e push:

```bash
git add Frontend/cupommaster-app/staticwebapp.config.json
git commit -m "Adiciona configuração para Azure Static Web Apps"
git push
```

---

## 🔐 Passo 7: Configurar CORS no Backend

Atualize o CORS no backend para aceitar o domínio do Static Web App.

Edite `Backend/CupomMaster.API/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins(
                "http://localhost:4200",
                "https://cupommaster.azurestaticapps.net"
            )
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

Rebuild e redeploy:

```bash
cd Backend/CupomMaster.API
dotnet publish -c Release -o ./publish
Compress-Archive -Path ./publish/* -DestinationPath ./cupommaster-api.zip -Force

az webapp deployment source config-zip \
  --resource-group rg-cupommaster \
  --name cupommaster-api \
  --src ./cupommaster-api.zip
```

---

## ✅ Passo 8: Testar a Aplicação

1. Acesse o frontend: `https://cupommaster.azurestaticapps.net`
2. Faça login com:
   - **Admin:** admin / admin123
   - **Operador:** operador / operador123
3. Teste todas as funcionalidades

---

## 📊 Passo 9: Monitoramento (Opcional)

### Application Insights

```bash
# Criar Application Insights
az monitor app-insights component create \
  --app cupommaster-insights \
  --location brazilsouth \
  --resource-group rg-cupommaster

# Obter instrumentation key
az monitor app-insights component show \
  --app cupommaster-insights \
  --resource-group rg-cupommaster \
  --query instrumentationKey

# Adicionar ao App Service
az webapp config appsettings set \
  --resource-group rg-cupommaster \
  --name cupommaster-api \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="SUA_KEY_AQUI"
```

---

## 💰 Estimativa de Custos Mensais

### Tier Desenvolvimento/Teste
- Azure SQL Database (Basic): ~R$ 15
- App Service Plan (B1): ~R$ 45
- Static Web Apps (Free): R$ 0
- **Total: ~R$ 60/mês**

### Tier Produção Pequena
- Azure SQL Database (S0): ~R$ 45
- App Service Plan (B2): ~R$ 90
- Static Web Apps (Free): R$ 0
- Application Insights (Basic): ~R$ 20
- **Total: ~R$ 155/mês**

### Tier Produção Média
- Azure SQL Database (S1): ~R$ 90
- App Service Plan (S1): ~R$ 200
- Static Web Apps (Standard): ~R$ 30
- Application Insights (Pro): ~R$ 50
- **Total: ~R$ 370/mês**

---

## 🔧 Troubleshooting

### Backend não inicia
```bash
# Ver logs do App Service
az webapp log tail --resource-group rg-cupommaster --name cupommaster-api

# Verificar configurações
az webapp config appsettings list --resource-group rg-cupommaster --name cupommaster-api
```

### Erro de conexão com banco
- Verificar firewall rules do SQL Server
- Confirmar connection string correta
- Testar conexão via Azure Data Studio

### Frontend não carrega
- Verificar build: `ng build --configuration production`
- Ver logs no GitHub Actions
- Conferir environment.prod.ts com URL correta

### CORS Error
- Adicionar domínio do Static Web App no CORS do backend
- Redeploy do backend após alterar CORS

---

## 🔄 CI/CD Automático (GitHub Actions)

O Azure Static Web Apps já cria um workflow automaticamente. Para o backend, crie:

`.github/workflows/backend-deploy.yml`:

```yaml
name: Deploy Backend to Azure

on:
  push:
    branches: [ main ]
    paths:
      - 'Backend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '10.0.x'
      
      - name: Build
        run: |
          cd Backend/CupomMaster.API
          dotnet restore
          dotnet build -c Release
          dotnet publish -c Release -o ./publish
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'cupommaster-api'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./Backend/CupomMaster.API/publish
```

**Configurar Secret:**
1. No Azure Portal, vá para o App Service
2. Baixe o Publish Profile
3. No GitHub, vá em Settings > Secrets > Actions
4. Crie secret `AZURE_WEBAPP_PUBLISH_PROFILE` com o conteúdo do arquivo

---

## 🎯 Próximos Passos

1. **Custom Domain:** Configurar domínio próprio
2. **SSL Certificate:** Configurar HTTPS personalizado
3. **Backup:** Configurar backup automático do banco
4. **Scaling:** Configurar auto-scaling
5. **CDN:** Adicionar Azure CDN para melhor performance

---

## 📞 Comandos Úteis

```bash
# Ver todos os recursos
az resource list --resource-group rg-cupommaster --output table

# Deletar tudo (cuidado!)
az group delete --name rg-cupommaster --yes

# Ver custos
az consumption usage list --start-date 2025-11-01 --end-date 2025-11-30

# Restart do App Service
az webapp restart --resource-group rg-cupommaster --name cupommaster-api

# Ver logs em tempo real
az webapp log tail --resource-group rg-cupommaster --name cupommaster-api
```

---

**Última Atualização:** 23 de Novembro de 2025
