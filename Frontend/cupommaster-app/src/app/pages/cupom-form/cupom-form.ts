import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  cupom: any = {
    codigo: '',
    valorDesconto: 0,
    tipoDesconto: TipoDesconto.PERCENTUAL,
    dataValidade: new Date().toISOString().split('T')[0],
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit - CupomForm');
    this.loadLojas();
    
    this.route.params.subscribe(params => {
      console.log('Parâmetros da rota:', params);
      if (params['id']) {
        this.isEditMode = true;
        this.cupomId = +params['id'];
        console.log('Modo edição ativado. ID:', this.cupomId);
        this.loadCupom(this.cupomId);
      } else {
        console.log('Modo criação - sem ID na rota');
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
    console.log('Carregando cupom com ID:', id);
    this.cupomService.getCupomById(id).subscribe({
      next: (cupom) => {
        console.log('Cupom recebido do backend:', cupom);
        if (cupom) {
          this.cupom = { 
            codigo: cupom.codigo || '',
            valorDesconto: cupom.valorDesconto || 0,
            tipoDesconto: cupom.tipoDesconto ?? TipoDesconto.PERCENTUAL,
            dataValidade: cupom.dataValidade ? new Date(cupom.dataValidade).toISOString().split('T')[0] : '',
            quantidadeDisponivel: cupom.quantidadeDisponivel || 0,
            ativo: cupom.ativo ?? true,
            regrasUso: cupom.regrasUso || '',
            lojaId: cupom.lojaId
          };
          console.log('Cupom configurado para edi\u00e7\u00e3o:', this.cupom);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar cupom:', error);
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

    // Preparar o cupom para envio
    const cupomToSend = {
      ...this.cupom,
      dataValidade: this.cupom.dataValidade ? new Date(this.cupom.dataValidade).toISOString() : new Date().toISOString(),
      tipoDesconto: Number(this.cupom.tipoDesconto)
    };

    const observable = this.isEditMode
      ? this.cupomService.updateCupom(this.cupomId!, cupomToSend)
      : this.cupomService.createCupom(cupomToSend);

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
