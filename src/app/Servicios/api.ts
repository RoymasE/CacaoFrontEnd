import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export const API_BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class Api {
  constructor(private http: HttpClient) {}
  get<T>(path: string): Observable<T> { return this.http.get<T>(`${API_BASE}${path}`); }
  post<T>(path: string, body: unknown = {}): Observable<T> { return this.http.post<T>(`${API_BASE}${path}`, body); }
  put<T>(path: string, body: unknown): Observable<T> { return this.http.put<T>(`${API_BASE}${path}`, body); }
  patch<T>(path: string, body: unknown = {}): Observable<T> { return this.http.patch<T>(`${API_BASE}${path}`, body); }
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, { username, password });
  }
}

export interface AuthResponse { token: string; tokenType: string; username: string; rol: string; nombreCompleto: string; }
