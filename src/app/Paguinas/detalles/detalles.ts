import { Component, OnInit } from '@angular/core';
import { Api } from '../../Servicios/api';
@Component({ selector: 'app-detalles', standalone: false, templateUrl: './detalles.html', styleUrl: './detalles.css' })
export class Detalles implements OnInit {
  summary: Record<string, any> | null = null; error = ''; loading = true;
  constructor(private api: Api) {}
  ngOnInit(): void { this.api.get<Record<string, any>>('/dashboard/resumen').subscribe({next:d=>{this.summary=d;this.loading=false;},error:e=>{this.error=e.status===0?'No hay conexión con el backend en http://localhost:8080.':`No se pudo cargar el resumen (${e.status}).`;this.loading=false;}}); }
  metrics(): [string,string][] { if(!this.summary)return []; return [['Cosecha recibida',`${this.summary['totalCosechadoKg'] ?? 0} kg`],['Stock de granos',`${this.summary['stockDisponibleGranosKg'] ?? 0} kg`],['Stock de polvo',`${this.summary['stockDisponiblePolvoKg'] ?? 0} kg`],['Ventas',`$ ${this.summary['totalVentasUsd'] ?? 0}`],['Lotes fermentando',String(this.summary['lotesEnFermentacion'] ?? 0)],['Pedidos pendientes',String(this.summary['pedidosPendientes'] ?? 0)],['Alertas de temperatura',String(this.summary['alertasTemperaturaActivas'] ?? 0)],['Exportado',`${this.summary['totalExportadoKg'] ?? 0} kg`]]; }
}
