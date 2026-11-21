import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../modelos/customers';

// Cambia esta URL para que coincida con la ruta publicada por tu backend.
const API_URL = 'http://localhost:8080/api/clientes';

@Injectable({ providedIn: 'root' })
export class ServicioCust {
  constructor(private http: HttpClient) {}

  listar(): Observable<Customer[]> {
    return this.http.get<Customer[]>(API_URL);
  }

  crear(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(API_URL, customer);
  }

  actualizar(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${API_URL}/${id}`, customer);
  }

  estado(id: number, activo: boolean): Observable<void> {
    return this.http.patch<void>(`${API_URL}/${id}/estado?activo=${activo}`, {});
  }
}
