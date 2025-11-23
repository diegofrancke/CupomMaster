import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user in sidebar:', currentUser);
    console.log('User role:', currentUser?.role);
    
    this.menuItems = [
      {
        label: 'Cliente',
        icon: '👤',
        path: '/dashboard',
        expanded: true,
        children: [
          { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
          { path: '/cupons', icon: '🎫', label: 'Cupons' },
          { path: '/lojas', icon: '🏪', label: 'Lojas' },
        ]
      }
    ];

    // Adiciona menu administrativo apenas para admins
    if (currentUser && currentUser.role === 0) {
      console.log('Adicionando menu administrativo para admin');
      this.menuItems.push({
        label: 'Administrativo',
        icon: '⚙️',
        path: '/usuarios',
        expanded: true,
        children: [
          { path: '/usuarios', icon: '👥', label: 'Usuários' },
          { path: '/cupons/uso', icon: '✅', label: 'Uso de Cupom' }
        ]
      });
    } else {
      console.log('Usuário não é admin, menu administrativo não será exibido');
    }
  }

  toggleMenu(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    }
  }
}
