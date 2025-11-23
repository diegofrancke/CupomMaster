import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, RouterModule, FormsModule, Navbar, Sidebar],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Usuários carregados:', users);
        this.users = users;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  getRoleName(role: number): string {
    return role === 0 ? 'Admin' : 'Operador';
  }

  getRoleClass(role: number): string {
    return role === 0 
      ? 'px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'
      : 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800';
  }

  deleteUser(id: number, username: string): void {
    if (confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          alert('Erro ao excluir usuário: ' + error.message);
        }
      });
    }
  }
}
