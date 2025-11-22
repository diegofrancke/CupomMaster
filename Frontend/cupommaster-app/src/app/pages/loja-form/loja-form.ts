import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { LojaService } from '../../services/loja.service';
import { Loja } from '../../models/cupom.model';

@Component({
  selector: 'app-loja-form',
  imports: [CommonModule, FormsModule, RouterModule, Navbar, Sidebar],
  templateUrl: './loja-form.html',
  styleUrl: './loja-form.css',
})
export class LojaForm implements OnInit {
  loja: Loja = {
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    ativo: true
  };

  isEditMode = false;
  loading = false;
  errorMessage = '';
  lojaId?: number;

  constructor(
    private lojaService: LojaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.lojaId = +params['id'];
        this.loadLoja(this.lojaId);
      }
    });
  }

  loadLoja(id: number): void {
    this.lojaService.getLojaById(id).subscribe({
      next: (loja) => {
        if (loja) {
          this.loja = { ...loja };
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar loja';
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const observable = this.isEditMode
      ? this.lojaService.updateLoja(this.lojaId!, this.loja)
      : this.lojaService.createLoja(this.loja);

    observable.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/lojas']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Erro ao salvar loja';
      }
    });
  }

  validateForm(): boolean {
    if (!this.loja.nome || !this.loja.cnpj || !this.loja.email) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loja.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/lojas']);
  }
}
