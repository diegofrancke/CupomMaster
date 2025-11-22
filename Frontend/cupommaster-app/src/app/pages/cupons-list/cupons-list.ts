import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CupomService } from '../../services/cupom.service';
import { Cupom, TipoDesconto } from '../../models/cupom.model';

@Component({
  selector: 'app-cupons-list',
  imports: [CommonModule, RouterModule, FormsModule, Navbar, Sidebar],
  templateUrl: './cupons-list.html',
  styleUrl: './cupons-list.css',
})
export class CuponsList implements OnInit {
  cupons: Cupom[] = [];
  filteredCupons: Cupom[] = [];
  loading = true;
  searchTerm = '';
  filterStatus: 'all' | 'active' | 'inactive' = 'all';

  constructor(
    private cupomService: CupomService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCupons();
  }

  loadCupons(): void {
    this.loading = true;
    this.cupomService.getCupons().subscribe({
      next: (cupons) => {
        console.log('Cupons carregados na listagem:', cupons);
        this.cupons = cupons;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar cupons:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredCupons = this.cupons.filter(cupom => {
      const matchesSearch = cupom.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           cupom.regrasUso?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.filterStatus === 'all' ||
                           (this.filterStatus === 'active' && cupom.ativo) ||
                           (this.filterStatus === 'inactive' && !cupom.ativo);
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  deleteCupom(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      this.cupomService.deleteCupom(id).subscribe({
        next: () => {
          this.loadCupons();
        },
        error: (error) => {
          alert('Erro ao excluir cupom: ' + error.message);
        }
      });
    }
  }

  getDescontoFormatado(cupom: Cupom): string {
    if (cupom.tipoDesconto === TipoDesconto.PERCENTUAL) {
      return `${cupom.valorDesconto}%`;
    }
    return `R$ ${cupom.valorDesconto.toFixed(2)}`;
  }

  isExpired(cupom: Cupom): boolean {
    return new Date(cupom.dataValidade) < new Date();
  }

  isEsgotado(cupom: Cupom): boolean {
    return cupom.quantidadeDisponivel <= (cupom.quantidadeUtilizada || 0);
  }
}
