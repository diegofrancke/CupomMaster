import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CupomService } from '../../services/cupom.service';
import { LojaService } from '../../services/loja.service';
import { Cupom, TipoDesconto, Loja } from '../../models/cupom.model';

@Component({
  selector: 'app-cupom-form',
  imports: [CommonModule, FormsModule, RouterModule, Navbar, Sidebar],
  templateUrl: './cupom-form.html',
  styleUrl: './cupom-form.css',
})
export class CupomForm implements OnInit {
  cupom: Cupom = {
    codigo: '',
    valorDesconto: 0,
    tipoDesconto: TipoDesconto.PERCENTUAL,
    dataValidade: new Date(),
    quantidadeDisponivel: 0,
    ativo: true,
    regrasUso: ''
  };

  lojas: Loja[] = [];
  tiposDesconto = TipoDesconto;
  isEditMode = false;
  loading = false;
  errorMessage = '';
  cupomId?: number;

  constructor(
    private cupomService: CupomService,
    private lojaService: LojaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadLojas();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.cupomId = +params['id'];
        this.loadCupom(this.cupomId);
      }
    });
  }

  loadLojas(): void {
    this.lojaService.getLojas().subscribe({
      next: (lojas) => {
        this.lojas = lojas;
      }
    });
  }

  loadCupom(id: number): void {
    this.cupomService.getCupomById(id).subscribe({
      next: (cupom) => {
        if (cupom) {
          this.cupom = { ...cupom };
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar cupom';
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
      ? this.cupomService.updateCupom(this.cupomId!, this.cupom)
      : this.cupomService.createCupom(this.cupom);

    observable.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/cupons']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Erro ao salvar cupom';
      }
    });
  }

  validateForm(): boolean {
    if (!this.cupom.codigo || !this.cupom.valorDesconto || !this.cupom.quantidadeDisponivel) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return false;
    }

    if (this.cupom.valorDesconto <= 0) {
      this.errorMessage = 'O valor do desconto deve ser maior que zero';
      return false;
    }

    if (this.cupom.tipoDesconto === TipoDesconto.PERCENTUAL && this.cupom.valorDesconto > 100) {
      this.errorMessage = 'O desconto percentual não pode ser maior que 100%';
      return false;
    }

    if (this.cupom.quantidadeDisponivel <= 0) {
      this.errorMessage = 'A quantidade disponível deve ser maior que zero';
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/cupons']);
  }
}
