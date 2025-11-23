# Especificações Técnicas - CupomMaster

## 📋 Visão Geral do Sistema

Sistema web full-stack para gerenciamento de cupons de desconto com arquitetura cliente-servidor, implementando padrões de desenvolvimento modernos, autenticação JWT e controle de acesso baseado em roles.

---

## 🏗️ Arquitetura

### Padrão Arquitetural
- **Backend:** Clean Architecture com separação de camadas (Controllers, Services, Data)
- **Frontend:** Component-based Architecture (Angular)
- **Comunicação:** REST API com JSON
- **Autenticação:** JWT Bearer Token

### Diagrama de Arquitetura
```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Angular 21)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Components │  │   Services  │  │  Guards/Interceptors│   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                           │ HTTPS/JSON
                           │ JWT Token
┌───────────────────────────▼─────────────────────────────────┐
│                  Backend (ASP.NET Core 10.0)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │ Controllers │─▶│  Services   │─▶│  Data/DbContext  │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                           │ Entity Framework Core
┌───────────────────────────▼─────────────────────────────────┐
│              Database (SQL Server LocalDB)                   │
│        Tables: Users, Cupoms, Lojas, HistoricoUsos         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend - ASP.NET Core 10.0

### Tecnologias e Frameworks

#### Core Framework
- **ASP.NET Core:** 10.0.0
- **Linguagem:** C# 12.0
- **Runtime:** .NET 10.0

#### Pacotes NuGet
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="10.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="10.0.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="10.0.1" />
<PackageReference Include="Microsoft.OpenApi" Version="2.3.0" />
```

### Estrutura de Camadas

#### 1. Controllers (Presentation Layer)
- **Responsabilidade:** Receber requisições HTTP, validar entrada, retornar respostas
- **Padrão:** RESTful API
- **Roteamento:** Attribute routing (`[Route("api/[controller]")]`)
- **Autorização:** Attribute-based (`[Authorize]`, `[Authorize(Roles = "ADMIN")]`)

**Controllers Implementados:**
```csharp
AuthController
├── POST /api/Auth/login
├── POST /api/Auth/register
├── GET /api/Auth/users [ADMIN]
├── POST /api/Auth/users [ADMIN]
├── PUT /api/Auth/users/{id} [ADMIN]
└── DELETE /api/Auth/users/{id} [ADMIN]

CupomsController
├── GET /api/Cupoms
├── GET /api/Cupoms/{id}
├── GET /api/Cupoms/codigo/{codigo}
├── POST /api/Cupoms
├── PUT /api/Cupoms/{id}
├── DELETE /api/Cupoms/{id}
├── POST /api/Cupoms/validar
├── POST /api/Cupoms/{id}/usar
└── POST /api/Cupoms/registrar-uso [ADMIN]

LojasController
├── GET /api/Lojas
├── GET /api/Lojas/{id}
├── POST /api/Lojas
├── PUT /api/Lojas/{id}
└── DELETE /api/Lojas/{id}
```

#### 2. Services (Business Logic Layer)
- **Responsabilidade:** Implementar regras de negócio, validações e lógica de domínio
- **Padrão:** Dependency Injection via interfaces
- **Transações:** Gerenciadas pelo DbContext

**Interfaces e Implementações:**
- `IAuthService` / `AuthService` - Autenticação e gerenciamento de usuários
- `ICupomService` / `CupomService` - Lógica de cupons
- `ILojaService` / `LojaService` - Lógica de lojas

**Responsabilidades dos Services:**
- Validação de dados complexos
- Criptografia de senhas (BCrypt)
- Geração de JWT tokens
- Cálculo de descontos
- Validação de regras de negócio
- Manipulação de entidades do banco

#### 3. Data Layer
**ApplicationDbContext:**
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Cupom> Cupons { get; set; }
    public DbSet<Loja> Lojas { get; set; }
    public DbSet<HistoricoUso> HistoricoUsos { get; set; }
}
```

**Configurações:**
- Connection String: SQL Server LocalDB
- Migrations: Code-First approach
- Tracking: Enabled para auditoria (CreatedAt, UpdatedAt)

### Modelos de Dados (Entities)

#### User
```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
}

public enum UserRole
{
    ADMIN = 0,
    OPERADOR = 1
}
```

#### Cupom
```csharp
public class Cupom
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public decimal ValorDesconto { get; set; }
    public TipoDesconto TipoDesconto { get; set; }
    public DateTime DataValidade { get; set; }
    public int QuantidadeDisponivel { get; set; }
    public int QuantidadeUtilizada { get; set; }
    public bool Ativo { get; set; }
    public string? RegrasUso { get; set; }
    public int? LojaId { get; set; }
    public Loja? Loja { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public enum TipoDesconto
{
    PERCENTUAL = 0,
    VALOR_FIXO = 1
}
```

#### Loja
```csharp
public class Loja
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CNPJ { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Cupom> Cupons { get; set; }
}
```

#### HistoricoUso
```csharp
public class HistoricoUso
{
    public int Id { get; set; }
    public int CupomId { get; set; }
    public Cupom Cupom { get; set; }
    public DateTime DataUso { get; set; }
    public decimal ValorPedido { get; set; }
    public decimal ValorDesconto { get; set; }
    public int? LojaId { get; set; }
    public Loja? Loja { get; set; }
}
```

### DTOs (Data Transfer Objects)

**Propósito:** Separar as entidades de banco dos contratos da API

```csharp
// Exemplos
public class CupomDto { ... }
public class CreateCupomRequest { ... }
public class UpdateCupomRequest { ... }
public class LoginRequest { ... }
public class LoginResponse { ... }
public class RegisterRequest { ... }
```

**Benefícios:**
- Segurança: Não expor estrutura interna do banco
- Flexibilidade: Contratos da API independentes do modelo
- Versionamento: Facilita mudanças sem quebrar compatibilidade

### Configuração de Segurança

#### Autenticação JWT
```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = "CupomMaster",
            ValidateAudience = true,
            ValidAudience = "CupomMasterUsers",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });
```

**Parâmetros do Token:**
- **Algoritmo:** HMAC-SHA256
- **Validade:** 24 horas
- **Claims:** UserId, Username, Email, Role

#### CORS (Cross-Origin Resource Sharing)
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

#### Hash de Senha
- **Algoritmo:** BCrypt
- **Work Factor:** 12 rounds
- **Salt:** Gerado automaticamente por senha

### Configuração do Swagger/OpenAPI

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "CupomMaster API", 
        Version = "v1" 
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
});
```

---

## 🎨 Frontend - Angular 21

### Tecnologias e Frameworks

#### Core Framework
- **Angular:** 21.0.0
- **TypeScript:** 5.6.2
- **Node.js:** >=18.19.1
- **npm:** 11.6.2

#### Dependências Principais
```json
{
  "@angular/animations": "^21.0.0",
  "@angular/common": "^21.0.0",
  "@angular/compiler": "^21.0.0",
  "@angular/core": "^21.0.0",
  "@angular/forms": "^21.0.0",
  "@angular/platform-browser": "^21.0.0",
  "@angular/platform-browser-dynamic": "^21.0.0",
  "@angular/router": "^21.0.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.15.0"
}
```

#### Dependências de Desenvolvimento
```json
{
  "@angular-devkit/build-angular": "^21.0.0",
  "@angular/cli": "^21.0.0",
  "@angular/compiler-cli": "^21.0.0",
  "tailwindcss": "^3.4.18",
  "postcss": "^8.4.49",
  "autoprefixer": "^10.4.20",
  "typescript": "~5.6.2"
}
```

### Arquitetura de Components

#### Estrutura Hierárquica
```
App Component (Root)
├── Router Outlet
    ├── Public Routes
    │   ├── Login Component
    │   └── Register Component
    └── Protected Routes (authGuard)
        ├── Layout Components
        │   ├── Navbar Component
        │   └── Sidebar Component
        └── Feature Components
            ├── Dashboard Component
            ├── Cupons Module
            │   ├── CuponsList Component
            │   ├── CupomForm Component
            │   └── CupomUso Component [ADMIN]
            ├── Lojas Module
            │   ├── LojasList Component
            │   └── LojaForm Component
            └── Users Module [ADMIN]
                ├── UsersList Component
                └── UserForm Component
```

### Components Detalhados

#### 1. Layout Components

**Navbar Component**
```typescript
@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  currentUser: User | null = null;
  
  // Métodos
  ngOnInit(): void
  getUserRoleText(): string
  logout(): void
}
```

**Sidebar Component**
```typescript
interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule]
})
export class Sidebar implements OnInit {
  menuItems: MenuItem[] = [];
  
  // Métodos
  ngOnInit(): void
  toggleMenu(item: MenuItem): void
}
```

#### 2. Feature Components

**Estrutura Padrão de CRUD:**
```typescript
// List Component
export class EntityList implements OnInit {
  entities: Entity[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  filterStatus: string = 'todos';
  
  ngOnInit(): void
  loadEntities(): void
  search(): void
  filter(status: string): void
  delete(id: number): void
}

// Form Component
export class EntityForm implements OnInit {
  entity: Entity = {...};
  isEditMode: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  
  ngOnInit(): void
  loadEntity(id: number): void
  onSubmit(): void
  formatField(field: string): void
}
```

### Services (HTTP Client)

#### Estrutura Base
```typescript
@Injectable({
  providedIn: 'root'
})
export class EntityService {
  private apiUrl = `${environment.apiUrl}/Entity`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Entity[]>
  getById(id: number): Observable<Entity>
  create(entity: Entity): Observable<Entity>
  update(id: number, entity: Entity): Observable<Entity>
  delete(id: number): Observable<any>
}
```

#### Services Implementados
1. **AuthService** - Autenticação, gerenciamento de token e usuário atual
2. **CupomService** - CRUD de cupons, validação e registro de uso
3. **LojaService** - CRUD de lojas
4. **UserService** - CRUD de usuários (admin)

### Guards e Interceptors

#### AuthGuard
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
```

**Funcionalidade:**
- Verifica se o usuário está autenticado
- Redireciona para login se não estiver
- Protege todas as rotas internas

#### LoginGuard
```typescript
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};
```

**Funcionalidade:**
- Evita acesso à página de login quando já logado
- Redireciona para dashboard se autenticado

#### AuthInterceptor
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (isPlatformBrowser(inject(PLATFORM_ID))) {
    const token = localStorage.getItem('token');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
  
  return next(req);
};
```

**Funcionalidade:**
- Adiciona token JWT automaticamente em todas as requisições
- Compatível com SSR (verifica se está no browser)

### Routing Configuration

```typescript
export const routes: Routes = [
  // Root redirect
  { path: '', canActivate: [rootRedirect], children: [] },
  
  // Public routes
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  
  // Protected routes
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'cupons', component: CuponsList, canActivate: [authGuard] },
  { path: 'cupons/novo', component: CupomForm, canActivate: [authGuard] },
  { path: 'cupons/editar/:id', component: CupomForm, canActivate: [authGuard] },
  { path: 'cupons/uso', component: CupomUso, canActivate: [authGuard] },
  { path: 'lojas', component: LojasList, canActivate: [authGuard] },
  { path: 'lojas/nova', component: LojaForm, canActivate: [authGuard] },
  { path: 'lojas/editar/:id', component: LojaForm, canActivate: [authGuard] },
  
  // Admin only routes
  { path: 'usuarios', component: UsersList, canActivate: [authGuard] },
  { path: 'usuarios/novo', component: UserForm, canActivate: [authGuard] },
  { path: 'usuarios/editar/:id', component: UserForm, canActivate: [authGuard] },
  
  // Wildcard
  { path: '**', canActivate: [rootRedirect], children: [] }
];
```

### State Management

**Estratégia:** Services com BehaviorSubject (sem NgRx)

```typescript
// AuthService
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();
```

**Vantagens:**
- Simplicidade para escopo do projeto
- Menos boilerplate
- Fácil manutenção

### Styling - Tailwind CSS

#### Configuração
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... cores customizadas
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

#### Classes Utilitárias Customizadas
```css
/* styles.css */
.btn-primary {
  @apply px-6 py-2 bg-primary-600 hover:bg-primary-700 
         text-white rounded-lg transition duration-200;
}

.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.card {
  @apply bg-white rounded-lg shadow-md p-6;
}
```

### Configuração de Build

#### angular.json (Produção)
```json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "2MB",
          "maximumError": "5MB"
        }
      ],
      "outputHashing": "all",
      "optimization": true,
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "buildOptimizer": true
    }
  }
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"],
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "moduleResolution": "node"
  }
}
```

---

## 🗄️ Database - SQL Server LocalDB

### Schema Design

#### Tabelas

**Users**
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role INT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    INDEX IX_Users_Username (Username),
    INDEX IX_Users_Email (Email)
);
```

**Lojas**
```sql
CREATE TABLE Lojas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nome NVARCHAR(100) NOT NULL,
    CNPJ NVARCHAR(14) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL,
    Telefone NVARCHAR(15) NOT NULL,
    Endereco NVARCHAR(255) NOT NULL,
    Ativo BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    INDEX IX_Lojas_CNPJ (CNPJ),
    INDEX IX_Lojas_Ativo (Ativo)
);
```

**Cupoms**
```sql
CREATE TABLE Cupoms (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Codigo NVARCHAR(50) NOT NULL UNIQUE,
    ValorDesconto DECIMAL(10,2) NOT NULL,
    TipoDesconto INT NOT NULL,
    DataValidade DATETIME2 NOT NULL,
    QuantidadeDisponivel INT NOT NULL,
    QuantidadeUtilizada INT NOT NULL DEFAULT 0,
    Ativo BIT NOT NULL DEFAULT 1,
    RegrasUso NVARCHAR(500),
    LojaId INT,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (LojaId) REFERENCES Lojas(Id),
    INDEX IX_Cupoms_Codigo (Codigo),
    INDEX IX_Cupoms_Ativo (Ativo),
    INDEX IX_Cupoms_DataValidade (DataValidade)
);
```

**HistoricoUsos**
```sql
CREATE TABLE HistoricoUsos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CupomId INT NOT NULL,
    LojaId INT,
    DataUso DATETIME2 NOT NULL DEFAULT GETDATE(),
    ValorPedido DECIMAL(10,2) NOT NULL,
    ValorDesconto DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (CupomId) REFERENCES Cupoms(Id) ON DELETE CASCADE,
    FOREIGN KEY (LojaId) REFERENCES Lojas(Id),
    INDEX IX_HistoricoUsos_CupomId (CupomId),
    INDEX IX_HistoricoUsos_DataUso (DataUso)
);
```

### Relacionamentos

```
Users (1) ──── (N) [Sistema de autenticação]

Lojas (1) ──── (N) Cupoms [Cupom pode ser específico de uma loja]
      (1) ──── (N) HistoricoUsos [Histórico por loja]

Cupoms (1) ──── (N) HistoricoUsos [Histórico de cada cupom]
```

### Índices e Performance

**Estratégia de Indexação:**
1. **Primary Keys:** Clustered index automático
2. **Foreign Keys:** Non-clustered indexes
3. **Campos de Busca Frequente:** Username, Email, Codigo, CNPJ
4. **Campos de Filtro:** Ativo, DataValidade, DataUso

**Query Optimization:**
- Include eager loading com `.Include()` para evitar N+1
- Usar `.AsNoTracking()` para queries read-only
- Paginação implementada quando necessário

### Migrations

**Estratégia:** Code-First com EF Core Migrations

```bash
# Criar migration
dotnet ef migrations add MigrationName

# Aplicar ao banco
dotnet ef database update

# Reverter
dotnet ef database update PreviousMigration

# Remover última migration (se não aplicada)
dotnet ef migrations remove
```

**Migrations Existentes:**
1. `InitialCreate` - Criação inicial das tabelas

---

## 🔐 Segurança

### Autenticação

#### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1",
    "unique_name": "admin",
    "email": "admin@cupommaster.com",
    "role": "ADMIN",
    "nbf": 1700000000,
    "exp": 1700086400,
    "iat": 1700000000,
    "iss": "CupomMaster",
    "aud": "CupomMasterUsers"
  }
}
```

#### Token Lifecycle
1. **Geração:** Login bem-sucedido
2. **Armazenamento:** localStorage (frontend)
3. **Transmissão:** Authorization header (Bearer scheme)
4. **Validação:** Cada requisição ao backend
5. **Expiração:** 24 horas
6. **Renovação:** Re-login necessário

### Autorização

#### Role-Based Access Control (RBAC)

**Roles:**
```csharp
public enum UserRole
{
    ADMIN = 0,      // Acesso total
    OPERADOR = 1    // Acesso limitado
}
```

**Matriz de Permissões:**
| Funcionalidade | ADMIN | OPERADOR |
|---|---|---|
| Dashboard | ✅ | ✅ |
| Listar Cupons | ✅ | ✅ |
| Criar/Editar Cupons | ✅ | ✅ |
| Excluir Cupons | ✅ | ✅ |
| Listar Lojas | ✅ | ✅ |
| Criar/Editar Lojas | ✅ | ✅ |
| Excluir Lojas | ✅ | ✅ |
| Gerenciar Usuários | ✅ | ❌ |
| Registrar Uso de Cupom | ✅ | ❌ |

**Implementação Backend:**
```csharp
[Authorize(Roles = "ADMIN")]
public async Task<IActionResult> AdminOnlyEndpoint() { ... }
```

**Implementação Frontend:**
```typescript
// Conditional rendering
*ngIf="currentUser && currentUser.role === 0"

// Menu visibility
if (currentUser && currentUser.role === 0) {
  this.menuItems.push(adminMenu);
}
```

### Proteção de Dados

#### Senhas
- **Hash:** BCrypt com salt automático
- **Work Factor:** 12 rounds
- **Nunca armazenadas em plain text**
- **Validação:** Mínimo 6 caracteres no frontend

#### Dados Sensíveis
- **CNPJ:** Validação de formato e unicidade
- **Email:** Validação de formato e unicidade
- **Tokens:** Não logados, transmitidos apenas via HTTPS

#### SQL Injection Prevention
- **Parameterized Queries:** Entity Framework usa automaticamente
- **Input Validation:** Todos os inputs validados

#### XSS Prevention
- **Angular Sanitization:** Automática nos templates
- **Content Security Policy:** Configurável

#### CSRF Protection
- **JWT em Header:** Não em cookies (CSRF não aplicável)
- **SameSite Cookies:** Se implementado no futuro

---

## 📊 Performance

### Backend Optimizations

#### Database
- **Connection Pooling:** Habilitado por padrão
- **Async/Await:** Todas as operações de I/O são assíncronas
- **Eager Loading:** `.Include()` para evitar N+1 queries
- **No Tracking:** `.AsNoTracking()` em queries read-only

#### API Response
- **Compression:** Gzip habilitado
- **Caching:** Response caching quando apropriado
- **Pagination:** Implementável para grandes datasets

### Frontend Optimizations

#### Build
- **AOT Compilation:** Enabled em produção
- **Tree Shaking:** Remove código não usado
- **Lazy Loading:** Módulos carregados sob demanda
- **Code Splitting:** Chunks otimizados

#### Runtime
- **Change Detection:** OnPush strategy quando possível
- **TrackBy Functions:** Em *ngFor para listas
- **Unsubscribe:** Evitar memory leaks com pipes async

#### Assets
- **Image Optimization:** Compressão de imagens
- **Font Loading:** System fonts + web fonts otimizados
- **CSS Purging:** Tailwind remove classes não usadas

---

## 🧪 Testing Strategy

### Backend Testing (Recomendado)

#### Unit Tests
```csharp
[Fact]
public async Task CreateCupom_WithValidData_ReturnsCreatedCupom()
{
    // Arrange
    var service = new CupomService(mockContext);
    var request = new CreateCupomRequest { ... };
    
    // Act
    var result = await service.CreateAsync(request);
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal(request.Codigo, result.Codigo);
}
```

**Framework:** xUnit + Moq

#### Integration Tests
```csharp
[Fact]
public async Task POST_Cupoms_WithValidToken_Returns201()
{
    // Arrange
    var client = _factory.CreateClient();
    client.DefaultRequestHeaders.Authorization = 
        new AuthenticationHeaderValue("Bearer", validToken);
    
    // Act
    var response = await client.PostAsJsonAsync("/api/Cupoms", cupom);
    
    // Assert
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
}
```

**Framework:** WebApplicationFactory

### Frontend Testing (Recomendado)

#### Unit Tests
```typescript
describe('CupomService', () => {
  it('should fetch cupons', (done) => {
    service.getCupons().subscribe(cupons => {
      expect(cupons.length).toBeGreaterThan(0);
      done();
    });
  });
});
```

**Framework:** Jasmine + Karma

#### Component Tests
```typescript
describe('CupomForm', () => {
  it('should create cupom on valid submit', () => {
    component.cupom = validCupom;
    component.onSubmit();
    expect(mockService.createCupom).toHaveBeenCalled();
  });
});
```

#### E2E Tests
```typescript
describe('Cupom Management', () => {
  it('should create new cupom', () => {
    cy.login('admin', 'admin123');
    cy.visit('/cupons/novo');
    cy.get('#codigo').type('TEST10');
    cy.get('button[type=submit]').click();
    cy.contains('Cupom criado com sucesso');
  });
});
```

**Framework:** Cypress (recomendado) ou Playwright

---

## 🚀 Deployment

### Backend Deployment

#### IIS (Production)
```xml
<!-- web.config -->
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore" path="*" verb="*" 
           modules="AspNetCoreModuleV2" />
    </handlers>
    <aspNetCore processPath="dotnet" 
                arguments=".\CupomMaster.API.dll" />
  </system.webServer>
</configuration>
```

#### Docker (Container)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["CupomMaster.API.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CupomMaster.API.dll"]
```

### Frontend Deployment

#### Build de Produção
```bash
ng build --configuration production
```

**Outputs:**
- Arquivos estáticos em `/dist`
- HTML, CSS, JS minificados
- Source maps opcionais

#### Nginx (Static Server)
```nginx
server {
    listen 80;
    server_name cupommaster.com;
    root /var/www/cupommaster/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://api.cupommaster.com;
    }
}
```

#### Azure Static Web Apps
```yaml
# staticwebapp.config.json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "https://api.cupommaster.com/api/{*}"
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ]
}
```

### Database Deployment

#### Migration Strategy
1. Backup do banco atual
2. Executar migrations pendentes
3. Verificar integridade
4. Rollback se necessário

```bash
# Production migration
dotnet ef database update --connection "ProductionConnectionString"
```

### Environment Variables

#### Backend (.env ou appsettings)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=CupomMaster;..."
  },
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-chars",
    "Issuer": "CupomMaster",
    "Audience": "CupomMasterUsers",
    "ExpirationHours": 24
  },
  "AllowedOrigins": ["https://cupommaster.com"]
}
```

#### Frontend (environment.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.cupommaster.com/api'
};
```

---

## 📈 Monitoring & Logging

### Backend Logging

#### Serilog (Recomendado)
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/cupommaster-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

**Níveis de Log:**
- **Debug:** Desenvolvimento
- **Information:** Operações normais
- **Warning:** Situações inesperadas mas recuperáveis
- **Error:** Erros que impedem operações
- **Critical:** Falhas críticas do sistema

### Frontend Error Handling

#### Global Error Handler
```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    console.error('Global error:', error);
    // Enviar para serviço de monitoramento
  }
}
```

### Application Insights (Azure)
```typescript
// Angular
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: { instrumentationKey: 'YOUR_KEY' }
});
```

---

## 🔧 Development Tools

### IDEs Recomendados
- **Backend:** Visual Studio 2022, VS Code com C# extension
- **Frontend:** VS Code com Angular Language Service
- **Database:** SQL Server Management Studio (SSMS), Azure Data Studio

### Extensions Úteis

#### VS Code
- Angular Language Service
- C# (OmniSharp)
- Tailwind CSS IntelliSense
- REST Client
- GitLens
- Prettier
- ESLint

### CLI Tools
```bash
# .NET CLI
dotnet new, build, run, test, ef

# Angular CLI
ng new, serve, build, test, generate

# npm/node
npm install, start, run, test
```

---

## 📚 Documentation Standards

### Code Documentation

#### XML Comments (C#)
```csharp
/// <summary>
/// Valida um cupom baseado nas regras de negócio
/// </summary>
/// <param name="request">Dados da validação</param>
/// <returns>Resposta com status de validação</returns>
public async Task<ValidacaoCupomResponse> ValidarCupomAsync(
    ValidacaoCupomRequest request)
```

#### JSDoc (TypeScript)
```typescript
/**
 * Registra o uso de um cupom em uma loja
 * @param cupomId - ID do cupom
 * @param lojaId - ID da loja
 * @param valorPedido - Valor total do pedido
 * @returns Observable com a resposta
 */
registrarUsoCupom(cupomId: number, lojaId: number, valorPedido: number): 
  Observable<RegistrarUsoCupomResponse>
```

### API Documentation
- **Swagger/OpenAPI:** Gerado automaticamente
- **Postman Collections:** Para testes manuais
- **README:** Instruções de uso

---

## 🔄 CI/CD Pipeline (Recomendado)

### GitHub Actions
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '10.0.x'
      - name: Restore
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --no-build

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install
        run: npm ci
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
```

---

## 📞 Suporte Técnico

### Troubleshooting Comum

#### Backend não inicia
1. Verificar se SQL Server LocalDB está instalado
2. Executar `dotnet ef database update`
3. Verificar porta 44358 disponível

#### Frontend não conecta
1. Confirmar backend rodando
2. Verificar `environment.ts` com URL correta
3. Verificar CORS configurado

#### Erros de autenticação
1. Limpar localStorage
2. Verificar token não expirado
3. Verificar secret key consistente

---

## 📄 Licença e Autoria

**Projeto:** CupomMaster  
**Versão:** 1.0.0  
**Autor:** Diego Francke  
**Ano:** 2025  
**Licença:** Privado - Uso Educacional  

---

## 🎯 Roadmap Futuro

### Melhorias Planejadas
- [ ] Paginação nas listagens
- [ ] Relatórios de uso de cupons
- [ ] Dashboard com gráficos (Chart.js)
- [ ] Notificações em tempo real (SignalR)
- [ ] Exportação de dados (Excel, PDF)
- [ ] Testes automatizados (Unit, Integration, E2E)
- [ ] CI/CD com GitHub Actions
- [ ] Docker compose para desenvolvimento
- [ ] Logs centralizados (ELK Stack)
- [ ] Cache distribuído (Redis)
- [ ] API versionamento
- [ ] Multi-tenant support
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Internacionalização (i18n)

---

**Última Atualização:** 23 de Novembro de 2025
