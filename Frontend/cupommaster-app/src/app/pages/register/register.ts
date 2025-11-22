import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData: RegisterRequest = {
    username: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    role: UserRole.OPERADOR
  };

  userRoles = UserRole;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    this.authService.register(this.registerData).subscribe({
      next: (user) => {
        this.loading = false;
        this.successMessage = 'Usuário cadastrado com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Erro ao cadastrar usuário';
      }
    });
  }

  private validateForm(): boolean {
    if (!this.registerData.username || !this.registerData.email || 
        !this.registerData.password || !this.registerData.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return false;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return false;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }

    return true;
  }
}
