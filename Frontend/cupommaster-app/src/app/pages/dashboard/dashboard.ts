import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CupomService } from '../../services/cupom.service';
import { LojaService } from '../../services/loja.service';
import { Cupom, Loja } from '../../models/cupom.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, Navbar, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalCupons = 0;
  cuponsAtivos = 0;
  totalLojas = 0;
  cuponsUtilizados = 0;

  loading = true;

  constructor(
    private cupomService: CupomService,
    private lojaService: LojaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    let cuponsLoaded = false;
    let lojasLoaded = false;

    const checkIfComplete = () => {
      if (cuponsLoaded && lojasLoaded) {
        console.log('Ambos carregados, setando loading = false');
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    this.cupomService.getCupons().subscribe({
      next: (cupons) => {
        console.log('Cupons carregados:', cupons);
        this.totalCupons = cupons.length;
        this.cuponsAtivos = cupons.filter(c => c.ativo).length;
        this.cuponsUtilizados = cupons.reduce((sum, c) => sum + (c.quantidadeUtilizada || 0), 0);
        cuponsLoaded = true;
        checkIfComplete();
      },
      error: (error) => {
        console.error('Erro ao carregar cupons:', error);
        cuponsLoaded = true;
        checkIfComplete();
      }
    });

    this.lojaService.getLojas().subscribe({
      next: (lojas) => {
        console.log('Lojas carregadas:', lojas);
        this.totalLojas = lojas.length;
        lojasLoaded = true;
        checkIfComplete();
      },
      error: (error) => {
        console.error('Erro ao carregar lojas:', error);
        lojasLoaded = true;
        checkIfComplete();
      }
    });
  }
}
