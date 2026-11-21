import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Api } from '../../Servicios/api';
import { canWritePage } from '../../Servicios/roles';

interface Field {
  key: string;
  label: string;
  type?: string;
  options?: string[];
}

interface PageConfig {
  title: string;
  description: string;
  endpoint: string;
  icon?: string;
  fields?: Field[];
}

const pages: Record<string, PageConfig> = {
  usuarios: {
    title: 'Usuarios y Roles',
    description: 'Gestión de cuentas internas del equipo y asignación de permisos del sistema.',
    endpoint: '/usuarios',
    icon: 'manage_accounts',
    fields: [
      { key: 'username', label: 'Nombre de usuario' },
      { key: 'password', label: 'Contraseña', type: 'password' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellido', label: 'Apellido' },
      { key: 'email', label: 'Correo electrónico', type: 'email' },
      {
        key: 'rol',
        label: 'Rol del sistema',
        type: 'select',
        options: ['ADMIN', 'GERENTE', 'JEFE_PLANTA', 'ACOPIADOR', 'VENDEDOR', 'SUPERVISOR_CALIDAD'],
      },
    ],
  },
  proveedores: {
    title: 'Directorio de Proveedores',
    description: 'Registro de agricultores asociados, parcelas de origen y contratos comunales.',
    endpoint: '/proveedores',
    icon: 'handshake',
    fields: [
      { key: 'nombreCompleto', label: 'Nombre completo' },
      { key: 'dniRuc', label: 'DNI / RUC' },
      { key: 'comunidadSector', label: 'Comunidad / sector' },
      { key: 'parcelaOrigen', label: 'Parcela de origen' },
      { key: 'codigoContratoComunal', label: 'Código contrato comunal' },
      { key: 'telefono', label: 'Teléfono de contacto' },
      { key: 'hectareas', label: 'Hectáreas cultivadas', type: 'number' },
    ],
  },
  lotes: {
    title: 'Recepción de Cosecha',
    description: 'Control de ingreso de lotes de cacao en baba y asignación inmediata a cajones.',
    endpoint: '/cosecha/lotes',
    icon: 'agriculture',
    fields: [
      { key: 'codigoLote', label: 'Código de lote oficial' },
      { key: 'fechaCosecha', label: 'Fecha de cosecha', type: 'date' },
      { key: 'fechaRecepcion', label: 'Fecha de recepción', type: 'date' },
      { key: 'proveedorId', label: 'ID de proveedor', type: 'number' },
      { key: 'cajonId', label: 'ID cajón disponible', type: 'number' },
      { key: 'variedad', label: 'Variedad de cacao' },
      { key: 'pesoBabaKg', label: 'Peso en baba (kg)', type: 'number' },
      { key: 'observaciones', label: 'Observaciones generales' },
    ],
  },
  cajones: {
    title: 'Cajones de Fermentación',
    description: 'Estado, capacidad en kilogramos y tipo de madera de los cajones escalonados.',
    endpoint: '/cajones',
    icon: 'view_in_ar',
    fields: [
      { key: 'codigoCajon', label: 'Código de cajón' },
      { key: 'capacidadKg', label: 'Capacidad máxima (kg)', type: 'number' },
      { key: 'tipoMadera', label: 'Tipo de madera' },
    ],
  },
  fermentacion: {
    title: 'Monitoreo de Fermentación',
    description: 'Registro diario de volteos, lecturas de temperatura y alertas de fermentado.',
    endpoint: '/fermentacion/alertas',
    icon: 'thermostat',
    fields: [
      { key: 'loteId', label: 'ID de lote', type: 'number' },
      { key: 'diaNumero', label: 'Día de proceso (1–6)', type: 'number' },
      { key: 'fechaRegistro', label: 'Fecha de medición', type: 'date' },
      { key: 'temperaturaCelsius', label: 'Temperatura (°C)', type: 'number' },
      { key: 'volteoRealizado', label: 'Volteo realizado', type: 'select', options: ['true', 'false'] },
      { key: 'observaciones', label: 'Observaciones de masa' },
    ],
  },
  secado: {
    title: 'Control de Secado',
    description: 'Monitoreo de pérdida de humedad y obtención de peso seco para almacenamiento.',
    endpoint: '/secado',
    icon: 'wb_sunny',
    fields: [
      { key: 'loteId', label: 'ID de lote', type: 'number' },
      { key: 'fechaInicio', label: 'Fecha inicio de secado', type: 'date' },
      { key: 'fechaFin', label: 'Fecha estimada/fin', type: 'date' },
      { key: 'humedadPorcentaje', label: 'Humedad final (%)', type: 'number' },
      { key: 'pesoSecoKg', label: 'Peso seco obtenido (kg)', type: 'number' },
      { key: 'diasSecado', label: 'Días de exposición al sol', type: 'number' },
      { key: 'observaciones', label: 'Observaciones' },
    ],
  },
  granos: {
    title: 'Inventario de Granos Secos',
    description: 'Pesajes de sacos de cacao seco de exportación (Sección 1) y grados de calidad.',
    endpoint: '/pesajes/seccion-1-granos',
    icon: 'grain',
    fields: [
      { key: 'loteId', label: 'ID de lote', type: 'number' },
      { key: 'fechaPesaje', label: 'Fecha de pesaje', type: 'date' },
      { key: 'pesoGranosKg', label: 'Peso de granos (kg)', type: 'number' },
      { key: 'calidadGrado', label: 'Grado de calidad (Grado 1, Premium)' },
      { key: 'observaciones', label: 'Observaciones de empaque' },
    ],
  },
  derivados: {
    title: 'Procesamiento de Cacao y Derivados',
    description: 'Rendimientos de polvo, manteca de cacao y registro de mermas (Sección 2).',
    endpoint: '/pesajes/seccion-2-polvo',
    icon: 'cookie',
    fields: [
      { key: 'loteOrigenId', label: 'ID lote de origen', type: 'number' },
      { key: 'fechaProcesamiento', label: 'Fecha de proceso', type: 'date' },
      { key: 'pesoMateriaPrimaKg', label: 'Materia prima usada (kg)', type: 'number' },
      { key: 'pesoPolvoCacaoKg', label: 'Polvo de cacao obtenido (kg)', type: 'number' },
      { key: 'pesoMantecaCacaoKg', label: 'Manteca obtenida (kg)', type: 'number' },
      { key: 'pesoCascarillaMermaKg', label: 'Cascarilla / merma (kg)', type: 'number' },
      { key: 'observaciones', label: 'Observaciones' },
    ],
  },
  pedidos: {
    title: 'Pedidos y Ventas Internacionales',
    description: 'Gestión de órdenes comerciales, reserva de existencias y precios por tonelada.',
    endpoint: '/pedidos',
    icon: 'receipt_long',
    fields: [
      { key: 'numeroPedido', label: 'Número de contrato / pedido' },
      { key: 'clienteId', label: 'ID de cliente importador', type: 'number' },
      { key: 'fechaPedido', label: 'Fecha del pedido', type: 'date' },
      {
        key: 'seccionProducto',
        label: 'Tipo de producto',
        type: 'select',
        options: ['SECCION_1_GRANOS', 'SECCION_2_POLVO'],
      },
      { key: 'cantidadKg', label: 'Cantidad solicitada (kg)', type: 'number' },
      { key: 'precioUnitarioUsd', label: 'Precio unitario (USD/kg)', type: 'number' },
      { key: 'destinoFinal', label: 'País / puerto destino' },
      { key: 'notas', label: 'Condiciones de venta' },
    ],
  },
  packing: {
    title: 'Packing Lists y Despachos',
    description: 'Documentación para aduanas, contenedores marítimos y sacos de yute para exportar.',
    endpoint: '/packing-list',
    icon: 'local_shipping',
    fields: [
      { key: 'codigoPackingList', label: 'Código packing list' },
      { key: 'pedidoId', label: 'ID pedido confirmado', type: 'number' },
      { key: 'fechaDespacho', label: 'Fecha de despacho', type: 'date' },
      { key: 'puertoOrigen', label: 'Puerto de origen' },
      { key: 'puertoDestino', label: 'Puerto de destino' },
      { key: 'navieraBuque', label: 'Naviera / buque' },
      { key: 'numeroContenedor', label: 'Número de contenedor' },
      { key: 'precintoAduanero', label: 'Precinto aduanero' },
      { key: 'totalSacosYute', label: 'Total sacos de yute', type: 'number' },
      { key: 'pesoNetoKg', label: 'Peso neto total (kg)', type: 'number' },
      { key: 'pesoBrutoKg', label: 'Peso bruto total (kg)', type: 'number' },
      { key: 'observaciones', label: 'Observaciones de embarque' },
    ],
  },
  areas: {
    title: 'Áreas Operativas de Planta',
    description: 'Zonas físicas de la agroindustria, parámetros de fermentación y responsables.',
    endpoint: '/areas',
    icon: 'factory',
    fields: [
      { key: 'nombre', label: 'Nombre del área' },
      { key: 'descripcion', label: 'Descripción de operaciones' },
      { key: 'responsable', label: 'Responsable de área' },
    ],
  },
  balance: {
    title: 'Balance Integral de Masas',
    description: 'Correlación del flujo productivo desde cacao en baba hasta exportación y mermas.',
    endpoint: '/balance/integral',
    icon: 'monitoring',
  },
};

@Component({
  selector: 'app-operacion',
  standalone: false,
  templateUrl: './operacion.html',
  styleUrl: './operacion.css',
})
export class Operacion implements OnInit {
  config!: PageConfig;
  rows: Record<string, any>[] = [];
  draft: Record<string, any> = {};
  loading = true;
  saving = false;
  error = '';
  notice = '';
  routeKey = '';
  editingId: number | null = null;
  detail: Record<string, any> | null = null;
  lookupId = '';
  searchQuery = '';
  showForm = false;

  constructor(private route: ActivatedRoute, private api: Api) {}

  canWrite(): boolean {
    return canWritePage(this.routeKey, localStorage.getItem('cacao_rol'));
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.routeKey = data['page'];
      this.config = pages[this.routeKey];
      this.draft = {};
      this.detail = null;
      this.searchQuery = '';
      this.showForm = false;
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.get<Record<string, any>[] | Record<string, any>>(this.config.endpoint).subscribe({
      next: data => {
        this.rows = Array.isArray(data) ? data : data && typeof data === 'object' ? [data] : [];
        this.loading = false;
      },
      error: e => {
        this.error = this.message(e);
        this.loading = false;
      },
    });
  }

  get filteredRows(): Record<string, any>[] {
    if (!this.searchQuery.trim()) return this.rows;
    const q = this.searchQuery.toLowerCase();
    return this.rows.filter(row =>
      Object.values(row).some(val => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
        return String(val).toLowerCase().includes(q);
      })
    );
  }

  save(): void {
    this.saving = true;
    this.error = '';
    this.notice = '';
    const endpoint =
      this.routeKey === 'fermentacion'
        ? '/fermentacion/monitoreo'
        : this.routeKey === 'secado'
        ? '/secado/control'
        : this.routeKey === 'usuarios' && this.editingId === null
        ? '/auth/register'
        : this.config.endpoint;

    const payload = { ...this.draft };
    for (const f of this.config.fields || []) {
      if (f.type === 'number' && payload[f.key] !== undefined && payload[f.key] !== '') {
        payload[f.key] = Number(payload[f.key]);
      }
    }
    if (this.routeKey === 'fermentacion' && payload['volteoRealizado'] !== undefined) {
      payload['volteoRealizado'] = payload['volteoRealizado'] === 'true';
    }
    if (this.routeKey === 'usuarios' && this.editingId !== null && !payload['password']) {
      delete payload['password'];
    }

    const request = this.editingId !== null ? this.api.put(`${endpoint}/${this.editingId}`, payload) : this.api.post(endpoint, payload);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.draft = {};
        this.editingId = null;
        this.showForm = false;
        this.notice = 'Registro guardado exitosamente.';
        this.load();
      },
      error: e => {
        this.saving = false;
        this.error = this.message(e);
      },
    });
  }

  startNew(): void {
    this.editingId = null;
    this.draft = {};
    this.showForm = true;
  }

  cancelForm(): void {
    this.editingId = null;
    this.draft = {};
    this.showForm = false;
  }

  edit(row: Record<string, any>): void {
    this.editingId = row['id'];
    this.draft = {};
    for (const field of this.config.fields || []) {
      this.draft[field.key] = row[field.key] ?? '';
    }
    this.showForm = true;
    this.error = '';
    this.notice = '';
  }

  completeFermentation(row: Record<string, any>): void {
    this.api.post(`/fermentacion/completar/${row['id']}`, {}).subscribe({
      next: () => {
        this.notice = 'Fermentación del lote completada.';
        this.load();
      },
      error: e => (this.error = this.message(e)),
    });
  }

  confirmOrder(row: Record<string, any>): void {
    this.api.post(`/pedidos/${row['id']}/confirmar`, {}).subscribe({
      next: () => {
        this.notice = 'Pedido confirmado y stock de producto reservado.';
        this.load();
      },
      error: e => (this.error = this.message(e)),
    });
  }

  setBoxState(row: Record<string, any>, state: string): void {
    this.api.patch(`/cajones/${row['id']}/estado?estado=${state}`).subscribe({
      next: () => this.load(),
      error: e => (this.error = this.message(e)),
    });
  }

  showDetail(row: Record<string, any>): void {
    const endpoints: Record<string, string> = {
      usuarios: '/usuarios',
      proveedores: '/proveedores',
      lotes: '/cosecha/lotes',
      cajones: '/cajones',
      pedidos: '/pedidos',
      packing: '/packing-list',
    };
    if (!endpoints[this.routeKey] || !row['id']) return;
    if ((this.routeKey === 'usuarios' || this.routeKey === 'proveedores') && this.canWrite()) {
      this.edit(row);
    }
    this.api.get<Record<string, any>>(`${endpoints[this.routeKey]}/${row['id']}`).subscribe({
      next: data => (this.detail = data),
      error: e => (this.error = this.message(e)),
    });
  }

  lookupLot(): void {
    const endpoints: Record<string, string> = {
      fermentacion: '/fermentacion/lote',
      secado: '/secado/lote',
      granos: '/pesajes/seccion-1-granos/lote',
    };
    if (!this.lookupId || !endpoints[this.routeKey]) return;
    this.api.get<any>(`${endpoints[this.routeKey]}/${this.lookupId}`).subscribe({
      next: data => {
        this.detail = data;
        this.error = '';
      },
      error: e => (this.error = this.message(e)),
    });
  }

  lookupCode(): void {
    if (!this.lookupId) return;
    this.api.get<any>(`/cosecha/lotes/codigo/${encodeURIComponent(this.lookupId)}`).subscribe({
      next: data => {
        this.detail = data;
        this.error = '';
      },
      error: e => (this.error = this.message(e)),
    });
  }

  toggleActive(row: Record<string, any>): void {
    const root = this.routeKey === 'usuarios' ? '/usuarios' : '/proveedores';
    this.api.patch(`${root}/${row['id']}/estado?activo=${row['activo'] === false}`).subscribe({
      next: () => this.load(),
      error: e => (this.error = this.message(e)),
    });
  }

  value(row: Record<string, any>, key: string): string {
    const v = row[key];
    return v && typeof v === 'object'
      ? v.nombreEmpresa || v.nombreCompleto || v.codigoLote || v.codigoCajon || v.numeroPedido || JSON.stringify(v)
      : v === null || v === undefined || v === ''
      ? '—'
      : String(v);
  }

  keys(row: Record<string, any>): string[] {
    return Object.keys(row).filter(k => !['fechaCreacion', 'fechaRegistro', 'fechaHoraCreacion'].includes(k));
  }

  getDetailEntries(): [string, any][] {
    if (!this.detail) return [];
    return Object.entries(this.detail);
  }

  formatEntryValue(val: any): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val);
  }

  private message(e: HttpErrorResponse): string {
    if (e.status === 0) return 'No se pudo conectar. Verifica que el backend esté activo en http://localhost:8080.';
    return e.error?.message || e.error?.error || `El backend respondió con estado ${e.status}.`;
  }
}
