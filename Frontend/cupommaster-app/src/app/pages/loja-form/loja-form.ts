import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit - LojaForm');
    this.route.params.subscribe(params => {
      console.log('Par\u00e2metros da rota:', params);
      if (params['id']) {
        this.isEditMode = true;
        this.lojaId = +params['id'];
        console.log('Modo edi\u00e7\u00e3o ativado. ID:', this.lojaId);
        this.loadLoja(this.lojaId);
      } else {
        console.log('Modo cria\u00e7\u00e3o - sem ID na rota');
      }
    });
  }

  loadLoja(id: number): void {
    console.log('Carregando loja com ID:', id);
    this.lojaService.getLojaById(id).subscribe({
      next: (loja) => {
        console.log('Loja recebida do backend:', loja);
        if (loja) {
          this.loja = { 
            nome: loja.nome || '',
            cnpj: this.formatCNPJValue(loja.cnpj || ''),
            email: loja.email || '',
            telefone: loja.telefone ? this.formatTelefoneValue(loja.telefone) : '',
            endereco: loja.endereco || '',
            ativo: loja.ativo ?? true
          };
          console.log('Loja configurada para edi\u00e7\u00e3o:', this.loja);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar loja:', error);
        this.errorMessage = 'Erro ao carregar loja';
      }
    });
  }

  private formatCNPJValue(cnpj: string): string {
    const value = cnpj.replace(/\D/g, '');
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  private formatTelefoneValue(telefone: string): string {
    const value = telefone.replace(/\D/g, '');
    if (value.length === 11) {
      return value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length === 10) {
      return value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return telefone;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Preparar loja para envio (remover formatação)
    const lojaToSend = {
      ...this.loja,
      cnpj: this.loja.cnpj.replace(/\D/g, ''),
      telefone: this.loja.telefone ? this.loja.telefone.replace(/\D/g, '') : ''
    };

    const observable = this.isEditMode
      ? this.lojaService.updateLoja(this.lojaId!, lojaToSend)
      : this.lojaService.createLoja(lojaToSend);

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

  formatCNPJ(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 14) {
      value = value.substring(0, 14);
    }
    
    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    this.loja.cnpj = value;
  }

  formatTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    if (value.length <= 11) {
      if (value.length <= 10) {
        // Formato: (00) 0000-0000
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        // Formato: (00) 00000-0000
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    
    this.loja.telefone = value;
  }

  validateForm(): boolean {
    if (!this.loja.nome || !this.loja.cnpj || !this.loja.email) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return false;
    }

    // Validar CNPJ (deve ter exatamente 14 dígitos)
    const cnpjNumbers = this.loja.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
      this.errorMessage = 'CNPJ deve conter exatamente 14 dígitos';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loja.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }

    // Validar telefone se preenchido
    if (this.loja.telefone) {
      const telefoneNumbers = this.loja.telefone.replace(/\D/g, '');
      if (telefoneNumbers.length < 10 || telefoneNumbers.length > 11) {
        this.errorMessage = 'Telefone deve conter 10 ou 11 dígitos';
        return false;
      }
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/lojas']);
  }
}
