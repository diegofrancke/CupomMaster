import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loja } from '../models/cupom.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private apiUrl = `${environment.apiUrl}/Lojas`;

  constructor(private http: HttpClient) { }

  getLojas(): Observable<Loja[]> {
    return this.http.get<Loja[]>(this.apiUrl);
  }

  getLojaById(id: number): Observable<Loja> {
    return this.http.get<Loja>(`${this.apiUrl}/${id}`);
  }

  createLoja(loja: Loja): Observable<Loja> {
    return this.http.post<Loja>(this.apiUrl, loja);
  }

  updateLoja(id: number, loja: Loja): Observable<Loja> {
    return this.http.put<Loja>(`${this.apiUrl}/${id}`, loja);
  }

  deleteLoja(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
