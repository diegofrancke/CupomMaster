import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CupomService } from '../../services/cupom.service';
import { LojaService } from '../../services/loja.service';
import { Cupom, Loja } from '../../models/cupom.model';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-cupom-uso',
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './cupom-uso.html',
  styleUrl: './cupom-uso.css',
})
export class CupomUso implements OnInit {
  cupons: Cupom[] = [];
  lojas: Loja[] = [];
  cupomId: number = 0;
  lojaId: number = 0;
  valorPedido: number = 0;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private cupomService: CupomService,
    private lojaService: LojaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCupons();
    this.loadLojas();
  }

  loadCupons(): void {
    this.cupomService.getCupons().subscribe({
      next: (data) => {
        // Filtrar apenas cupons ativos e não esgotados
        this.cupons = data.filter(c => 
          c.ativo && 
          (c.quantidadeUtilizada || 0) < c.quantidadeDisponivel &&
          new Date(c.dataValidade) > new Date()
        );
      },
      error: (err) => {
        console.error('Erro ao carregar cupons:', err);
        this.errorMessage = 'Erro ao carregar cupons';
      }
    });
  }

  loadLojas(): void {
    this.lojaService.getLojas().subscribe({
      next: (data) => {
        // Filtrar apenas lojas ativas
        this.lojas = data.filter(l => l.ativo);
      },
      error: (err) => {
        console.error('Erro ao carregar lojas:', err);
        this.errorMessage = 'Erro ao carregar lojas';
      }
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.cupomId || !this.lojaId || !this.valorPedido) {
      this.errorMessage = 'Preencha todos os campos';
      return;
    }

    if (this.valorPedido <= 0) {
      this.errorMessage = 'Valor do pedido deve ser maior que zero';
      return;
    }

    this.loading = true;

    this.cupomService.registrarUsoCupom(this.cupomId, this.lojaId, this.valorPedido).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message + 
          (response.valorDesconto ? ` - Desconto aplicado: R$ ${response.valorDesconto.toFixed(2)}` : '');
        
        // Limpar formulário
        this.cupomId = 0;
        this.lojaId = 0;
        this.valorPedido = 0;
        
        // Recarregar cupons para atualizar quantidades
        this.loadCupons();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao registrar uso:', err);
        this.errorMessage = err.error?.message || 'Erro ao registrar uso do cupom';
      }
    });
  }

  getCupomInfo(cupomId: number): string {
    const cupom = this.cupons.find(c => c.id === cupomId);
    if (!cupom) return '';
    
    const disponivel = cupom.quantidadeDisponivel - (cupom.quantidadeUtilizada || 0);
    return `Disponível: ${disponivel} de ${cupom.quantidadeDisponivel}`;
  }
}
