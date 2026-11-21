import { Component, OnInit } from '@angular/core';
import { Api } from '../../Servicios/api';
import { canAccessPage, ROLE_LABELS, AppRole } from '../../Servicios/roles';

export interface MetricCard {
  label: string;
  value: string;
  icon: string;
  tone: 'primary' | 'cacao' | 'amber' | 'emerald' | 'rose' | 'blue';
  highlight?: boolean;
}

@Component({
  selector: 'app-detalles',
  standalone: false,
  templateUrl: './detalles.html',
  styleUrl: './detalles.css',
})
export class Detalles implements OnInit {
  readonly links = [
    { page: 'lotes', path: '/lotes', title: 'Cosecha de Lotes', desc: 'Recepción de cacao en baba y pesajes', icon: 'agriculture', tone: 'green' },
    { page: 'cajones', path: '/cajones', title: 'Cajones', desc: 'Control de disponibilidad y tipos de madera', icon: 'view_in_ar', tone: 'sand' },
    { page: 'fermentacion', path: '/fermentacion', title: 'Fermentación', desc: 'Monitoreo de volteos y curvas térmicas', icon: 'thermostat', tone: 'green' },
    { page: 'secado', path: '/secado', title: 'Control de Secado', desc: 'Medición de humedad y peso seco final', icon: 'wb_sunny', tone: 'sand' },
    { page: 'granos', path: '/granos', title: 'Granos Secos', desc: 'Stock de sacos y pesajes de Sección 1', icon: 'grain', tone: 'green' },
    { page: 'derivados', path: '/derivados', title: 'Polvo y Manteca', desc: 'Procesamiento de Sección 2 y mermas', icon: 'cookie', tone: 'sand' },
    { page: 'clientes', path: '/clientes', title: 'Directorio Clientes', desc: 'Importadores internacionales asociados', icon: 'corporate_fare', tone: 'green' },
    { page: 'proveedores', path: '/proveedores', title: 'Proveedores', desc: 'Agricultores y parcelas comunales', icon: 'handshake', tone: 'sand' },
    { page: 'pedidos', path: '/pedidos', title: 'Pedidos y Ventas', desc: 'Contratos comerciales y reserva de stock', icon: 'receipt_long', tone: 'green' },
    { page: 'packing', path: '/packing', title: 'Packing Lists', desc: 'Contenedores y despachos marítimos', icon: 'local_shipping', tone: 'sand' },
    { page: 'balance', path: '/balance', title: 'Balance de Masas', desc: 'Flujo integral de materia prima y mermas', icon: 'monitoring', tone: 'green' },
    { page: 'usuarios', path: '/usuarios', title: 'Gestión Usuarios', desc: 'Cuentas internas y asignación de roles', icon: 'manage_accounts', tone: 'sand' },
    { page: 'areas', path: '/areas', title: 'Áreas de Planta', desc: 'Infraestructura agroindustrial', icon: 'factory', tone: 'green' },
  ];

  summary: Record<string, any> | null = null;
  error = '';
  loading = true;

  constructor(private api: Api) {}

  get username(): string {
    return localStorage.getItem('cacao_nombre') || 'Usuario';
  }

  get role(): string {
    return localStorage.getItem('cacao_rol') || '';
  }

  get roleLabel(): string {
    return ROLE_LABELS[this.role as AppRole] || this.role || 'Operador';
  }

  can(page: string): boolean {
    return canAccessPage(page, this.role);
  }

  get visibleLinks(): typeof this.links {
    return this.links.filter(link => this.can(link.page));
  }

  ngOnInit(): void {
    this.api.get<Record<string, any>>('/dashboard/resumen').subscribe({
      next: d => {
        this.summary = d;
        this.loading = false;
      },
      error: e => {
        this.error = e.status === 0 ? 'No hay conexión con el backend en http://localhost:8080.' : `No se pudo cargar el resumen (${e.status}).`;
        this.loading = false;
      },
    });
  }

  metricsList(): MetricCard[] {
    if (!this.summary) return [];
    const alerts = Number(this.summary['alertasTemperaturaActivas'] ?? 0);
    return [
      {
        label: 'Cosecha Recibida',
        value: `${Number(this.summary['totalCosechadoKg'] ?? 0).toLocaleString()} kg`,
        icon: 'agriculture',
        tone: 'emerald',
      },
      {
        label: 'Stock Granos Secos',
        value: `${Number(this.summary['stockDisponibleGranosKg'] ?? 0).toLocaleString()} kg`,
        icon: 'grain',
        tone: 'cacao',
      },
      {
        label: 'Stock Polvo & Manteca',
        value: `${Number(this.summary['stockDisponiblePolvoKg'] ?? 0).toLocaleString()} kg`,
        icon: 'cookie',
        tone: 'primary',
      },
      {
        label: 'Total Ventas',
        value: `$ ${Number(this.summary['totalVentasUsd'] ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'payments',
        tone: 'emerald',
      },
      {
        label: 'Lotes en Fermentación',
        value: String(this.summary['lotesEnFermentacion'] ?? 0),
        icon: 'thermostat',
        tone: 'blue',
      },
      {
        label: 'Pedidos Pendientes',
        value: String(this.summary['pedidosPendientes'] ?? 0),
        icon: 'pending_actions',
        tone: 'amber',
      },
      {
        label: 'Alertas Temperatura',
        value: String(alerts),
        icon: 'warning',
        tone: alerts > 0 ? 'rose' : 'emerald',
        highlight: alerts > 0,
      },
      {
        label: 'Total Exportado',
        value: `${Number(this.summary['totalExportadoKg'] ?? 0).toLocaleString()} kg`,
        icon: 'directions_boat',
        tone: 'primary',
      },
    ];
  }
}
