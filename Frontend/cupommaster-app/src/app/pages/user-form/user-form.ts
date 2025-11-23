import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UserService } from '../../services/user.service';
import { User, RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule, RouterModule, Navbar, Sidebar],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  user: any = {
    username: '',
    email: '',
    password: '',
    telefone: '',
    role: 1 // Default: Operador
  };

  confirmPassword = '';
  isEditMode = false;
  loading = false;
  errorMessage = '';
  userId?: number;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit - UserForm');
    this.route.params.subscribe(params => {
      console.log('Parâmetros da rota:', params);
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        console.log('Modo edição ativado. ID:', this.userId);
        this.loadUser(this.userId);
      } else {
        console.log('Modo criação - sem ID na rota');
      }
    });
  }

  loadUser(id: number): void {
    console.log('Carregando usuário com ID:', id);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        console.log('Usuário recebido do backend:', user);
        if (user) {
          this.user = {
            username: user.username || '',
            email: user.email || '',
            telefone: user.telefone || '',
            role: user.role ?? 1,
            password: '' // Não carrega a senha por segurança
          };
          console.log('Usuário configurado para edição:', this.user);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
        this.errorMessage = 'Erro ao carregar usuário';
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      // Atualização - não envia senha se estiver vazia
      const updateData: any = {
        username: this.user.username,
        email: this.user.email,
        telefone: this.user.telefone,
        role: Number(this.user.role)
      };

      if (this.user.password) {
        updateData.password = this.user.password;
      }

      this.userService.updateUser(this.userId!, updateData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erro ao atualizar usuário';
        }
      });
    } else {
      // Criação
      const registerData: RegisterRequest = {
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
        confirmPassword: this.confirmPassword,
        telefone: this.user.telefone,
        role: Number(this.user.role)
      };

      this.userService.createUser(registerData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erro ao criar usuário';
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.user.username || !this.user.email) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return false;
    }

    // Validar senha apenas na criação ou se preenchida na edição
    if (!this.isEditMode || this.user.password) {
      if (!this.user.password) {
        this.errorMessage = 'A senha é obrigatória';
        return false;
      }

      if (this.user.password.length < 6) {
        this.errorMessage = 'A senha deve ter no mínimo 6 caracteres';
        return false;
      }

      if (this.user.password !== this.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem';
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/usuarios']);
  }
}
