import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Api } from '../../Servicios/api';

interface Field { key: string; label: string; type?: string; options?: string[]; }
interface PageConfig { title: string; description: string; endpoint: string; fields?: Field[]; }
const pages: Record<string, PageConfig> = {
  usuarios: { title: 'Usuarios y roles', description: 'Cuentas internas y permisos del equipo.', endpoint: '/usuarios', fields: [
    {key:'username',label:'Usuario'}, {key:'password',label:'Contraseña',type:'password'}, {key:'nombre',label:'Nombre'}, {key:'apellido',label:'Apellido'}, {key:'email',label:'Correo'}, {key:'rol',label:'Rol',type:'select',options:['ADMIN','GERENTE','JEFE_PLANTA','ACOPIADOR','VENDEDOR','SUPERVISOR_CALIDAD']}] },
  proveedores: { title: 'Proveedores', description: 'Agricultores asociados y datos de origen.', endpoint: '/proveedores', fields: [
    {key:'nombreCompleto',label:'Nombre completo'}, {key:'dniRuc',label:'DNI / RUC'}, {key:'comunidadSector',label:'Comunidad / sector'}, {key:'parcelaOrigen',label:'Parcela de origen'}, {key:'codigoContratoComunal',label:'Contrato comunal'}, {key:'telefono',label:'Teléfono'}, {key:'hectareas',label:'Hectáreas',type:'number'}]},
  lotes: { title: 'Recepción de cosecha', description: 'Registra lotes de cacao en baba y su asignación.', endpoint: '/cosecha/lotes', fields: [
    {key:'codigoLote',label:'Código de lote'}, {key:'fechaCosecha',label:'Fecha de cosecha',type:'date'}, {key:'fechaRecepcion',label:'Fecha de recepción',type:'date'}, {key:'proveedorId',label:'ID proveedor',type:'number'}, {key:'cajonId',label:'ID cajón disponible',type:'number'}, {key:'variedad',label:'Variedad'}, {key:'pesoBabaKg',label:'Peso en baba (kg)',type:'number'}, {key:'observaciones',label:'Observaciones'}]},
  cajones: { title: 'Cajones de fermentación', description: 'Capacidad, tipo de madera y disponibilidad.', endpoint: '/cajones', fields: [
    {key:'codigoCajon',label:'Código cajón'}, {key:'capacidadKg',label:'Capacidad (kg)',type:'number'}, {key:'tipoMadera',label:'Tipo de madera'}]},
  fermentacion: { title: 'Monitoreo de fermentación', description: 'Control diario de temperatura y volteos por lote.', endpoint: '/fermentacion/alertas', fields: [
    {key:'loteId',label:'ID de lote',type:'number'}, {key:'diaNumero',label:'Día (1–6)',type:'number'}, {key:'fechaRegistro',label:'Fecha',type:'date'}, {key:'temperaturaCelsius',label:'Temperatura °C',type:'number'}, {key:'volteoRealizado',label:'Volteo realizado',type:'select',options:['true','false']}, {key:'observaciones',label:'Observaciones'}]},
  secado: { title: 'Control de secado', description: 'Registra humedad final y peso seco del lote.', endpoint: '/secado', fields: [
    {key:'loteId',label:'ID de lote',type:'number'}, {key:'fechaInicio',label:'Inicio',type:'date'}, {key:'fechaFin',label:'Fin',type:'date'}, {key:'humedadPorcentaje',label:'Humedad (%)',type:'number'}, {key:'pesoSecoKg',label:'Peso seco (kg)',type:'number'}, {key:'diasSecado',label:'Días de secado',type:'number'}, {key:'observaciones',label:'Observaciones'}]},
  granos: { title: 'Inventario de granos', description: 'Pesajes de granos secos y stock de exportación.', endpoint: '/pesajes/seccion-1-granos', fields: [
    {key:'loteId',label:'ID de lote',type:'number'}, {key:'fechaPesaje',label:'Fecha',type:'date'}, {key:'pesoGranosKg',label:'Peso (kg)',type:'number'}, {key:'calidadGrado',label:'Grado de calidad'}, {key:'observaciones',label:'Observaciones'}]},
  derivados: { title: 'Procesamiento de cacao', description: 'Registra polvo, manteca y mermas del procesamiento.', endpoint: '/pesajes/seccion-2-polvo', fields: [
    {key:'loteOrigenId',label:'ID lote origen',type:'number'}, {key:'fechaProcesamiento',label:'Fecha',type:'date'}, {key:'pesoMateriaPrimaKg',label:'Materia prima (kg)',type:'number'}, {key:'pesoPolvoCacaoKg',label:'Polvo (kg)',type:'number'}, {key:'pesoMantecaCacaoKg',label:'Manteca (kg)',type:'number'}, {key:'pesoCascarillaMermaKg',label:'Cascarilla / merma (kg)',type:'number'}, {key:'observaciones',label:'Observaciones'}]},
  pedidos: { title: 'Pedidos y ventas', description: 'Solicitudes internacionales y reserva de stock.', endpoint: '/pedidos', fields: [
    {key:'numeroPedido',label:'Número de pedido'}, {key:'clienteId',label:'ID cliente',type:'number'}, {key:'fechaPedido',label:'Fecha',type:'date'}, {key:'seccionProducto',label:'Producto',type:'select',options:['SECCION_1_GRANOS','SECCION_2_POLVO']}, {key:'cantidadKg',label:'Cantidad (kg)',type:'number'}, {key:'precioUnitarioUsd',label:'Precio unitario (USD)',type:'number'}, {key:'destinoFinal',label:'Destino final'}, {key:'notas',label:'Notas'}]},
  packing: { title: 'Packing lists', description: 'Documentos de despacho para exportación marítima.', endpoint: '/packing-list', fields: [
    {key:'codigoPackingList',label:'Código packing list'}, {key:'pedidoId',label:'ID pedido',type:'number'}, {key:'fechaDespacho',label:'Fecha despacho',type:'date'}, {key:'puertoOrigen',label:'Puerto de origen'}, {key:'puertoDestino',label:'Puerto de destino'}, {key:'navieraBuque',label:'Naviera / buque'}, {key:'numeroContenedor',label:'Contenedor'}, {key:'precintoAduanero',label:'Precinto aduanero'}, {key:'totalSacosYute',label:'Sacos de yute',type:'number'}, {key:'pesoNetoKg',label:'Peso neto (kg)',type:'number'}, {key:'pesoBrutoKg',label:'Peso bruto (kg)',type:'number'}, {key:'observaciones',label:'Observaciones'}]},
  areas: { title: 'Áreas de planta', description: 'Parámetros y áreas operativas de la agroindustria.', endpoint: '/areas', fields: [
    {key:'nombre',label:'Nombre'}, {key:'descripcion',label:'Descripción'}, {key:'responsable',label:'Responsable'}]},
  balance: { title: 'Balance integral de masas', description: 'Correlación del flujo productivo desde cosecha hasta exportación y mermas.', endpoint: '/balance/integral' },
};

@Component({ selector: 'app-operacion', standalone: false, templateUrl: './operacion.html', styleUrl: './operacion.css' })
export class Operacion implements OnInit {
  config!: PageConfig; rows: Record<string, any>[] = []; draft: Record<string, any> = {};
  loading = true; saving = false; error = ''; notice = ''; routeKey = ''; editingId: number | null = null;
  detail: Record<string, any> | null = null; lookupId = '';
  constructor(private route: ActivatedRoute, private api: Api) {}
  ngOnInit(): void { this.route.data.subscribe(data => { this.routeKey = data['page']; this.config = pages[this.routeKey]; this.draft = {}; this.load(); }); }
  load(): void { this.loading = true; this.error = ''; this.api.get<Record<string, any>[] | Record<string, any>>(this.config.endpoint).subscribe({next: data => { this.rows = Array.isArray(data) ? data : data && typeof data === 'object' ? [data] : []; this.loading = false; }, error: e => { this.error = this.message(e); this.loading = false; }}); }
  save(): void {
    this.saving = true; this.error = ''; this.notice = '';
    const endpoint = this.routeKey === 'fermentacion' ? '/fermentacion/monitoreo' : this.routeKey === 'secado' ? '/secado/control' : this.routeKey === 'usuarios' && this.editingId === null ? '/auth/register' : this.config.endpoint;
    const payload = {...this.draft};
    for (const f of this.config.fields || []) if (f.type === 'number' && payload[f.key] !== undefined && payload[f.key] !== '') payload[f.key] = Number(payload[f.key]);
    if (this.routeKey === 'fermentacion' && payload['volteoRealizado'] !== undefined) payload['volteoRealizado'] = payload['volteoRealizado'] === 'true';
    if (this.routeKey === 'usuarios' && this.editingId !== null && !payload['password']) delete payload['password'];
    const request = this.editingId !== null ? this.api.put(`${endpoint}/${this.editingId}`, payload) : this.api.post(endpoint, payload);
    request.subscribe({next: () => { this.saving = false; this.draft = {}; this.editingId = null; this.notice = 'Registro guardado correctamente.'; this.load(); }, error: e => { this.saving = false; this.error = this.message(e); }});
  }
  edit(row: Record<string,any>): void { this.editingId=row['id']; this.draft={}; for(const field of this.config.fields||[]) this.draft[field.key]=row[field.key]??''; this.error=''; this.notice=''; }
  completeFermentation(row: Record<string, any>): void { this.api.post(`/fermentacion/completar/${row['id']}`, {}).subscribe({next: () => {this.notice='Fermentación completada.';this.load();},error:e=>this.error=this.message(e)}); }
  confirmOrder(row: Record<string, any>): void { this.api.post(`/pedidos/${row['id']}/confirmar`, {}).subscribe({next: () => {this.notice='Pedido confirmado y stock reservado.';this.load();},error:e=>this.error=this.message(e)}); }
  setBoxState(row: Record<string, any>, state: string): void { this.api.patch(`/cajones/${row['id']}/estado?estado=${state}`).subscribe({next:()=>this.load(),error:e=>this.error=this.message(e)}); }
  showDetail(row: Record<string, any>): void {
    const endpoints: Record<string,string> = {usuarios:'/usuarios',proveedores:'/proveedores',lotes:'/cosecha/lotes',cajones:'/cajones',pedidos:'/pedidos',packing:'/packing-list'};
    if (!endpoints[this.routeKey] || !row['id']) return;
    this.api.get<Record<string,any>>(`${endpoints[this.routeKey]}/${row['id']}`).subscribe({next:data=>this.detail=data,error:e=>this.error=this.message(e)});
  }
  lookupLot(): void {
    const endpoints: Record<string,string> = {fermentacion:'/fermentacion/lote',secado:'/secado/lote',granos:'/pesajes/seccion-1-granos/lote'};
    if (!this.lookupId || !endpoints[this.routeKey]) return;
    this.api.get<any>(`${endpoints[this.routeKey]}/${this.lookupId}`).subscribe({next:data=>{this.detail=data;this.error='';},error:e=>this.error=this.message(e)});
  }
  lookupCode(): void { if(!this.lookupId)return; this.api.get<any>(`/cosecha/lotes/codigo/${encodeURIComponent(this.lookupId)}`).subscribe({next:data=>{this.detail=data;this.error='';},error:e=>this.error=this.message(e)}); }
  toggleActive(row: Record<string,any>): void {
    const root=this.routeKey==='usuarios'?'/usuarios':'/proveedores';
    this.api.patch(`${root}/${row['id']}/estado?activo=${row['activo']===false}`).subscribe({next:()=>this.load(),error:e=>this.error=this.message(e)});
  }
  value(row: Record<string, any>, key: string): string { const v=row[key]; return v && typeof v === 'object' ? (v.nombreEmpresa || v.nombreCompleto || v.codigoLote || v.codigoCajon || v.numeroPedido || JSON.stringify(v)) : (v === null || v === undefined || v === '' ? '—' : String(v)); }
  keys(row: Record<string, any>): string[] { return Object.keys(row).filter(k => !['fechaCreacion','fechaRegistro','fechaHoraCreacion'].includes(k)); }
  private message(e: HttpErrorResponse): string { if(e.status===0)return 'No se pudo conectar. Verifica que el backend esté activo en http://localhost:8080.'; return e.error?.message || e.error?.error || `El backend respondió con estado ${e.status}.`; }
}
