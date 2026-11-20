import { Component, OnInit } from '@angular/core';
import { Api } from '../../Servicios/api';
import { canAccessPage } from '../../Servicios/roles';
@Component({ selector: 'app-detalles', standalone: false, templateUrl: './detalles.html', styleUrl: './detalles.css' })
export class Detalles implements OnInit {
  readonly links = [
    {page:'lotes',path:'/lotes',title:'Cosecha',desc:'Recepción de lotes',icon:'◇',tone:'green'},
    {page:'cajones',path:'/cajones',title:'Cajones',desc:'Control de fermentación',icon:'▦',tone:'sand'},
    {page:'fermentacion',path:'/fermentacion',title:'Fermentación',desc:'Temperatura y volteos',icon:'◉',tone:'green'},
    {page:'secado',path:'/secado',title:'Secado',desc:'Humedad y peso seco',icon:'☼',tone:'sand'},
    {page:'granos',path:'/granos',title:'Granos secos',desc:'Pesaje y stock',icon:'◇',tone:'green'},
    {page:'derivados',path:'/derivados',title:'Polvo y derivados',desc:'Procesamiento',icon:'◇',tone:'sand'},
    {page:'clientes',path:'/clientes',title:'Clientes',desc:'Importadores',icon:'♧',tone:'green'},
    {page:'proveedores',path:'/proveedores',title:'Proveedores',desc:'Agricultores asociados',icon:'♧',tone:'sand'},
    {page:'pedidos',path:'/pedidos',title:'Pedidos',desc:'Ventas internacionales',icon:'↗',tone:'green'},
    {page:'packing',path:'/packing',title:'Packing list',desc:'Despachos de exportación',icon:'▤',tone:'sand'},
    {page:'balance',path:'/balance',title:'Balance integral',desc:'Flujo de masas',icon:'∑',tone:'green'},
    {page:'usuarios',path:'/usuarios',title:'Usuarios',desc:'Cuentas y roles',icon:'♙',tone:'sand'},
    {page:'areas',path:'/areas',title:'Áreas',desc:'Parámetros de planta',icon:'▦',tone:'green'},
  ];
  summary: Record<string, any> | null = null; error = ''; loading = true;
  constructor(private api: Api) {}
  can(page: string): boolean { return canAccessPage(page, localStorage.getItem('cacao_rol')); }
  get visibleLinks(): typeof this.links { return this.links.filter(link => this.can(link.page)); }
  ngOnInit(): void { this.api.get<Record<string, any>>('/dashboard/resumen').subscribe({next:d=>{this.summary=d;this.loading=false;},error:e=>{this.error=e.status===0?'No hay conexión con el backend en http://localhost:8080.':`No se pudo cargar el resumen (${e.status}).`;this.loading=false;}}); }
  metrics(): [string,string][] { if(!this.summary)return []; return [['Cosecha recibida',`${this.summary['totalCosechadoKg'] ?? 0} kg`],['Stock de granos',`${this.summary['stockDisponibleGranosKg'] ?? 0} kg`],['Stock de polvo',`${this.summary['stockDisponiblePolvoKg'] ?? 0} kg`],['Ventas',`$ ${this.summary['totalVentasUsd'] ?? 0}`],['Lotes fermentando',String(this.summary['lotesEnFermentacion'] ?? 0)],['Pedidos pendientes',String(this.summary['pedidosPendientes'] ?? 0)],['Alertas de temperatura',String(this.summary['alertasTemperaturaActivas'] ?? 0)],['Exportado',`${this.summary['totalExportadoKg'] ?? 0} kg`]]; }
}
