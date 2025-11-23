import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { LojaService } from '../../services/loja.service';
import { Loja } from '../../models/cupom.model';

@Component({
  selector: 'app-lojas-list',
  imports: [CommonModule, RouterModule, FormsModule, Navbar, Sidebar],
  templateUrl: './lojas-list.html',
  styleUrl: './lojas-list.css',
})
export class LojasList implements OnInit {
  lojas: Loja[] = [];
  filteredLojas: Loja[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private lojaService: LojaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLojas();
  }

  loadLojas(): void {
    this.loading = true;
    this.lojaService.getLojas().subscribe({
      next: (lojas) => {
        console.log('Lojas carregadas na listagem:', lojas);
        this.lojas = lojas;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar lojas:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredLojas = this.lojas.filter(loja =>
      loja.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      loja.cnpj.includes(this.searchTerm) ||
      loja.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  deleteLoja(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
      this.lojaService.deleteLoja(id).subscribe({
        next: () => {
          this.loadLojas();
        },
        error: (error) => {
          alert('Erro ao excluir loja: ' + error.message);
        }
      });
    }
  }

  formatCNPJ(cnpj: string): string {
    if (!cnpj) return '';
    const value = cnpj.replace(/\D/g, '');
    if (value.length !== 14) return cnpj;
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  formatTelefone(telefone: string): string {
    if (!telefone) return '';
    const value = telefone.replace(/\D/g, '');
    if (value.length === 11) {
      return value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length === 10) {
      return value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return telefone;
  }
}
