import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/cupons', icon: '🎫', label: 'Cupons' },
    { path: '/lojas', icon: '🏪', label: 'Lojas' },
  ];
}
