import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cupom } from '../models/cupom.model';
import { environment } from '../../environments/environment';

interface ValidacaoCupomRequest {
  codigo: string;
  valorPedido: number;
  lojaId?: number;
}

interface ValidacaoCupomResponse {
  valido: boolean;
  mensagem: string;
  cupom?: Cupom;
  valorDesconto?: number;
}

interface RegistrarUsoCupomRequest {
  cupomId: number;
  lojaId: number;
  valorPedido: number;
}

interface RegistrarUsoCupomResponse {
  message: string;
  valorDesconto?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CupomService {
  private apiUrl = `${environment.apiUrl}/Cupoms`;

  constructor(private http: HttpClient) { }

  getCupons(): Observable<Cupom[]> {
    return this.http.get<Cupom[]>(this.apiUrl);
  }

  getCupomById(id: number): Observable<Cupom> {
    return this.http.get<Cupom>(`${this.apiUrl}/${id}`);
  }

  createCupom(cupom: Cupom): Observable<Cupom> {
    return this.http.post<Cupom>(this.apiUrl, cupom);
  }

  updateCupom(id: number, cupom: Cupom): Observable<Cupom> {
    return this.http.put<Cupom>(`${this.apiUrl}/${id}`, cupom);
  }

  deleteCupom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  validarCupom(codigo: string, valorPedido: number, lojaId?: number): Observable<ValidacaoCupomResponse> {
    const request: ValidacaoCupomRequest = { codigo, valorPedido, lojaId };
    return this.http.post<ValidacaoCupomResponse>(`${this.apiUrl}/validar`, request);
  }

  registrarUsoCupom(cupomId: number, lojaId: number, valorPedido: number): Observable<RegistrarUsoCupomResponse> {
    const request: RegistrarUsoCupomRequest = { cupomId, lojaId, valorPedido };
    return this.http.post<RegistrarUsoCupomResponse>(`${this.apiUrl}/registrar-uso`, request);
  }
}
