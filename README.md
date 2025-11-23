# CupomMaster - Sistema de Gestão de Cupons

Sistema completo de gerenciamento de cupons de desconto com autenticação, controle de acesso baseado em roles e interface moderna.

## 📋 Índice
- [Tecnologias](#tecnologias)
- [Credenciais de Acesso](#credenciais-de-acesso)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)

---

## 🚀 Tecnologias

### Backend
- **ASP.NET Core 10.0** - Framework web
- **Entity Framework Core 10.0** - ORM para acesso ao banco de dados
- **SQL Server LocalDB** - Banco de dados
- **JWT Bearer** - Autenticação e autorização
- **BCrypt.Net** - Hash de senhas
- **Swagger/OpenAPI** - Documentação da API

### Frontend
- **Angular 21** - Framework SPA
- **Tailwind CSS 3.4** - Framework CSS utilitário
- **TypeScript** - Linguagem tipada

---

## 🔐 Credenciais de Acesso

O sistema possui dois níveis de acesso:

### Administrador (Acesso Total)
- **Usuário:** `admin`
- **Senha:** `admin123`
- **Permissões:** Acesso a todas as funcionalidades incluindo gerenciamento de usuários e registro de uso de cupons

### Operador (Acesso Limitado)
- **Usuário:** `operador`
- **Senha:** `operador123`
- **Permissões:** Acesso ao dashboard, gerenciamento de cupons e lojas (sem acesso ao menu administrativo)

---

## 📱 Funcionalidades

### 1. **Autenticação e Autorização**
- **Login/Logout:** Sistema de autenticação com JWT tokens
- **Registro:** Criação de novas contas de usuário
- **Controle de Acesso:** Baseado em roles (ADMIN = 0, OPERADOR = 1)
- **Proteção de Rotas:** Guards impedem acesso não autorizado
- **Sessão Persistente:** Token armazenado no localStorage

### 2. **Dashboard** 📊
- **Estatísticas em Tempo Real:**
  - Total de cupons cadastrados
  - Cupons ativos no sistema
  - Cupons já utilizados
  - Total de lojas parceiras
- **Ações Rápidas:** Links diretos para gerenciar cupons e lojas
- **Visualização por Cards:** Interface intuitiva com ícones e cores

### 3. **Gerenciamento de Cupons** 🎫

#### Listagem de Cupons
- Visualização em tabela responsiva
- Informações exibidas:
  - Código do cupom
  - Tipo de desconto (Percentual ou Valor Fixo)
  - Valor do desconto
  - Data de validade
  - Quantidade disponível/utilizada
  - Status (Ativo/Inativo)
  - Loja associada (se aplicável)
- Filtro por status (Todos, Ativos, Inativos)
- Busca por código ou loja
- Ações: Editar e Excluir

#### Criação/Edição de Cupons
- **Campos:**
  - Código único do cupom
  - Tipo de desconto (0 = Percentual, 1 = Valor Fixo)
  - Valor do desconto
  - Data de validade
  - Quantidade disponível
  - Status (Ativo/Inativo)
  - Regras de uso (opcional)
  - Loja específica (opcional - se não selecionado, válido para todas)
- **Validações:**
  - Código único no sistema
  - Data de validade não pode ser passada
  - Quantidade disponível deve ser maior que zero
  - Valor do desconto deve ser positivo

### 4. **Gerenciamento de Lojas** 🏪

#### Listagem de Lojas
- Visualização em tabela responsiva
- Informações exibidas:
  - Nome da loja
  - CNPJ formatado (00.000.000/0000-00)
  - Telefone formatado ((00) 00000-0000)
  - Email
  - Endereço
  - Status (Ativo/Inativo)
- Filtro por status
- Busca por nome, CNPJ ou email
- Ações: Editar e Excluir

#### Criação/Edição de Lojas
- **Campos:**
  - Nome da loja
  - CNPJ (14 dígitos com formatação automática)
  - Email
  - Telefone (10-11 dígitos com formatação automática)
  - Endereço completo
  - Status (Ativo/Inativo)
- **Validações:**
  - CNPJ único no sistema
  - Email válido
  - Telefone com 10 ou 11 dígitos
- **Formatação Automática:**
  - CNPJ: Converte para formato 00.000.000/0000-00
  - Telefone: Converte para formato (00) 00000-0000

### 5. **Gerenciamento de Usuários** 👥
**⚠️ Exclusivo para Administradores**

#### Listagem de Usuários
- Visualização de todos os usuários do sistema
- Informações exibidas:
  - Nome de usuário
  - Email
  - Role (Administrador/Operador)
  - Data de criação
- Badge visual para identificar o tipo de usuário
- Busca por username ou email
- Ações: Editar e Excluir

#### Criação/Edição de Usuários
- **Campos no Cadastro:**
  - Username único
  - Email válido
  - Senha (mínimo 6 caracteres)
  - Confirmação de senha
  - Role (0 = Administrador, 1 = Operador)
- **Campos na Edição:**
  - Username (não editável)
  - Email
  - Nova senha (opcional - deixe em branco para manter a atual)
  - Role
- **Validações:**
  - Username único no sistema
  - Email válido e único
  - Senhas devem coincidir no cadastro
  - Senha com hash BCrypt para segurança

### 6. **Registro de Uso de Cupom** 🎯
**⚠️ Exclusivo para Administradores**

- **Funcionalidade:** Simula o uso de um cupom por uma loja específica
- **Seleção de Cupom:** Lista apenas cupons ativos, não expirados e com quantidade disponível
- **Seleção de Loja:** Lista apenas lojas ativas
- **Valor do Pedido:** Campo para informar o valor da compra
- **Validações Automáticas:**
  - Verifica se cupom está ativo
  - Verifica se cupom não está expirado
  - Verifica se ainda há quantidade disponível
  - Verifica se loja está ativa
  - Valida se cupom pode ser usado na loja (cupons específicos)
- **Cálculo de Desconto:**
  - Percentual: Valor do pedido × (Percentual ÷ 100)
  - Valor Fixo: Valor fixo do cupom
- **Histórico:** Registra o uso no histórico com data, valores e loja
- **Incremento:** Aumenta automaticamente a quantidade utilizada do cupom

### 7. **Validação de Cupom** ✅
- Endpoint disponível para validar cupons antes do uso
- Verifica todas as regras de negócio
- Retorna valor do desconto calculado
- Pode ser usado em integrações futuras

---

## 📂 Estrutura do Projeto

```
CupomMaster/
│
├── Backend/
│   └── CupomMaster.API/
│       ├── Controllers/          # Endpoints da API
│       │   ├── AuthController.cs      # Autenticação e usuários
│       │   ├── CupomsController.cs    # CRUD de cupons
│       │   └── LojasController.cs     # CRUD de lojas
│       ├── Services/             # Lógica de negócio
│       │   ├── AuthService.cs         # Serviço de autenticação
│       │   ├── CupomService.cs        # Serviço de cupons
│       │   └── LojaService.cs         # Serviço de lojas
│       ├── Models/               # Entidades do banco
│       │   ├── User.cs               # Modelo de usuário
│       │   ├── Cupom.cs              # Modelo de cupom
│       │   ├── Loja.cs               # Modelo de loja
│       │   └── HistoricoUso.cs       # Histórico de uso
│       ├── DTOs/                 # Data Transfer Objects
│       ├── Data/                 # Contexto do banco
│       └── Migrations/           # Migrações do EF Core
│
├── Frontend/
│   └── cupommaster-app/
│       └── src/
│           └── app/
│               ├── components/       # Componentes reutilizáveis
│               │   ├── navbar/          # Barra superior
│               │   └── sidebar/         # Menu lateral
│               ├── pages/            # Páginas da aplicação
│               │   ├── login/           # Tela de login
│               │   ├── register/        # Tela de registro
│               │   ├── dashboard/       # Dashboard principal
│               │   ├── cupons-list/     # Lista de cupons
│               │   ├── cupom-form/      # Formulário de cupom
│               │   ├── cupom-uso/       # Registro de uso (admin)
│               │   ├── lojas-list/      # Lista de lojas
│               │   ├── loja-form/       # Formulário de loja
│               │   ├── users-list/      # Lista de usuários (admin)
│               │   └── user-form/       # Formulário de usuário (admin)
│               ├── services/         # Serviços HTTP
│               │   ├── auth.service.ts    # Serviço de autenticação
│               │   ├── cupom.service.ts   # Serviço de cupons
│               │   ├── loja.service.ts    # Serviço de lojas
│               │   └── user.service.ts    # Serviço de usuários
│               ├── guards/           # Guards de rota
│               │   ├── auth.guard.ts      # Proteção de rotas autenticadas
│               │   └── login.guard.ts     # Redireciona se já logado
│               ├── interceptors/     # Interceptadores HTTP
│               │   └── auth.interceptor.ts # Adiciona token JWT
│               └── models/           # Interfaces TypeScript
│                   ├── cupom.model.ts     # Interface de cupom
│                   └── user.model.ts      # Interface de usuário
│
└── Database/
    ├── 01-CreateDatabase.sql    # Script de criação do banco
    ├── 02-CreateTables.sql      # Script de criação das tabelas
    └── 03-SeedData.sql          # Dados iniciais (usuários de teste)
```

---

## 🎨 Interface do Usuário

### Menu de Navegação
O menu lateral é organizado hierarquicamente:

#### Menu Cliente (Todos os usuários)
- 🏠 **Dashboard** - Visão geral do sistema
- 🎫 **Cupons** - Gerenciamento de cupons
- 🏪 **Lojas** - Gerenciamento de lojas

#### Menu Administrativo (Apenas Administradores)
- 👥 **Usuários** - Gerenciamento de usuários do sistema
- 🎯 **Uso de Cupom** - Registro manual de uso de cupons

### Barra Superior (Navbar)
- Logo "CupomMaster"
- Nome do usuário logado
- Tipo de usuário (Administrador/Operador)
- Botão "Sair" (vermelho)

---

## 🔄 Fluxo de Uso

### 1. Primeiro Acesso (Administrador)
1. Acesse `http://localhost:4200`
2. Faça login com as credenciais de administrador
3. Explore o dashboard para ver as estatísticas
4. Cadastre lojas parceiras em "Lojas"
5. Crie cupons de desconto em "Cupons"
6. (Opcional) Crie usuários operadores em "Usuários"

### 2. Operações Comuns

#### Criar um Cupom
1. Menu lateral: **Cupons** → Botão "Novo Cupom"
2. Preencha os dados:
   - Código único (ex: DESCONTO10)
   - Tipo: Percentual (0) ou Valor Fixo (1)
   - Valor do desconto
   - Data de validade
   - Quantidade disponível
   - Marque como "Ativo"
   - (Opcional) Selecione uma loja específica
3. Clique em "Salvar"

#### Registrar Uso de Cupom (Admin)
1. Menu lateral: **Administrativo** → "Uso de Cupom"
2. Selecione o cupom desejado
3. Selecione a loja onde será usado
4. Informe o valor do pedido
5. Clique em "Registrar Uso"
6. Sistema calcula o desconto e registra no histórico

#### Gerenciar Usuários (Admin)
1. Menu lateral: **Administrativo** → "Usuários"
2. Para adicionar: Botão "Novo Usuário"
3. Preencha username, email, senha e role
4. Para editar: Clique no botão "Editar" da linha do usuário
5. Para excluir: Clique no botão "Excluir"

---

## 🚀 Como Executar

### Pré-requisitos
- .NET 10.0 SDK
- Node.js 18+ e npm
- SQL Server LocalDB

### Backend
```bash
cd Backend/CupomMaster.API
dotnet restore
dotnet ef database update
dotnet run
```
O backend estará disponível em: `https://localhost:44358`
Swagger UI: `https://localhost:44358/swagger`

### Frontend
```bash
cd Frontend/cupommaster-app
npm install
ng serve
```
O frontend estará disponível em: `http://localhost:4200`

---

## 🔒 Segurança

- **Senhas:** Armazenadas com hash BCrypt (never em plain text)
- **JWT Tokens:** Expiração configurável, renovação automática
- **CORS:** Configurado para aceitar apenas origens específicas
- **Authorization:** Endpoints protegidos com `[Authorize]`
- **Role-based Access:** Funcionalidades administrativas restritas por role

---

## 📊 Modelos de Dados

### User
- Id (int)
- Username (string, unique)
- Email (string, unique)
- PasswordHash (string)
- Role (enum: ADMIN = 0, OPERADOR = 1)
- CreatedAt (DateTime)

### Cupom
- Id (int)
- Codigo (string, unique)
- ValorDesconto (decimal)
- TipoDesconto (enum: PERCENTUAL = 0, VALOR_FIXO = 1)
- DataValidade (DateTime)
- QuantidadeDisponivel (int)
- QuantidadeUtilizada (int)
- Ativo (bool)
- RegrasUso (string, opcional)
- LojaId (int?, opcional)
- CreatedAt/UpdatedAt (DateTime)

### Loja
- Id (int)
- Nome (string)
- CNPJ (string, unique)
- Email (string)
- Telefone (string)
- Endereco (string)
- Ativo (bool)
- CreatedAt/UpdatedAt (DateTime)

### HistoricoUso
- Id (int)
- CupomId (int)
- LojaId (int?)
- DataUso (DateTime)
- ValorPedido (decimal)
- ValorDesconto (decimal)

---

## 🎯 Regras de Negócio

1. **Cupons:**
   - Código deve ser único
   - Data de validade não pode ser no passado
   - Quantidade disponível ≥ Quantidade utilizada
   - Cupom pode ser geral ou específico de uma loja
   - Ao atingir quantidade máxima, não pode mais ser usado

2. **Lojas:**
   - CNPJ deve ser único
   - Apenas lojas ativas aparecem em seleções
   - Formatação automática de CNPJ e telefone

3. **Uso de Cupom:**
   - Cupom deve estar ativo
   - Não pode estar expirado
   - Deve ter quantidade disponível
   - Loja deve estar ativa
   - Se cupom é específico, só pode ser usado na loja correta
   - Desconto calculado automaticamente conforme tipo

4. **Usuários:**
   - Username e email devem ser únicos
   - Senha mínimo 6 caracteres
   - Apenas admins podem gerenciar usuários
   - Apenas admins podem registrar uso de cupons

---

## 📝 Endpoints da API

### Autenticação
- `POST /api/Auth/login` - Login
- `POST /api/Auth/register` - Registro
- `GET /api/Auth/users` - Listar usuários (admin)
- `POST /api/Auth/users` - Criar usuário (admin)
- `PUT /api/Auth/users/{id}` - Atualizar usuário (admin)
- `DELETE /api/Auth/users/{id}` - Excluir usuário (admin)

### Cupons
- `GET /api/Cupoms` - Listar todos
- `GET /api/Cupoms/{id}` - Buscar por ID
- `GET /api/Cupoms/codigo/{codigo}` - Buscar por código
- `POST /api/Cupoms` - Criar cupom
- `PUT /api/Cupoms/{id}` - Atualizar cupom
- `DELETE /api/Cupoms/{id}` - Excluir cupom
- `POST /api/Cupoms/validar` - Validar cupom
- `POST /api/Cupoms/registrar-uso` - Registrar uso (admin)

### Lojas
- `GET /api/Lojas` - Listar todas
- `GET /api/Lojas/{id}` - Buscar por ID
- `POST /api/Lojas` - Criar loja
- `PUT /api/Lojas/{id}` - Atualizar loja
- `DELETE /api/Lojas/{id}` - Excluir loja

---

## 🐛 Troubleshooting

### Backend não inicia
- Verifique se o SQL Server LocalDB está instalado
- Execute `dotnet ef database update` para criar o banco
- Verifique se a porta 44358 não está em uso

### Frontend não conecta ao backend
- Confirme que o backend está rodando em `https://localhost:44358`
- Verifique o arquivo `environment.ts` - deve ter `apiUrl: 'https://localhost:44358/api'`
- Limpe o cache do navegador e tente novamente

### Erro de autenticação
- Limpe o localStorage do navegador
- Faça logout e login novamente
- Verifique se o token JWT não expirou

---

## 👨‍💻 Desenvolvido por
Diego Francke - 2025

## 📄 Licença
Este projeto é privado e de uso educacional.
