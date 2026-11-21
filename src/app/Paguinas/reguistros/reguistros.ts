import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../../modelos/customers';
import { ServicioCust } from '../../Servicios/serviciocust';

@Component({ selector: 'app-reguistros', standalone: false, templateUrl: './reguistros.html', styleUrl: './reguistros.css' })
export class Reguistros implements OnInit {
  customers: Customer[] = [];
  draft: Customer = this.vacio();
  cargando = true;
  guardando = false;
  editingId: number | null = null;
  error = '';
  notice = '';
  query = '';

  constructor(private api: ServicioCust) {}

  ngOnInit(): void { this.recargar(); }

  get filtrados(): Customer[] {
    const q = this.query.trim().toLocaleLowerCase();
    return this.customers.filter(c => !q || `${c.nombreEmpresa} ${c.email} ${c.paisDestino} ${c.personaContacto}`.toLocaleLowerCase().includes(q));
  }

  guardar(): void {
    this.error = ''; this.notice = ''; this.guardando = true;
    const request = this.editingId === null ? this.api.crear(this.draft) : this.api.actualizar(this.editingId, this.draft);
    request.subscribe({
      next: () => { this.notice = this.editingId === null ? 'Cliente agregado correctamente.' : 'Cambios guardados.'; this.cancelar(); this.recargar(false); },
      error: e => { this.error = this.mensajeError(e); this.guardando = false; },
    });
  }

  editar(customer: Customer): void {
    if (customer.id === undefined) return;
    this.editingId = customer.id;
    this.draft = { ...customer };
    this.error = ''; this.notice = '';
  }

  eliminar(customer: Customer): void {
    if (customer.id === undefined || !confirm(`¿${customer.activo === false ? 'Activar' : 'Desactivar'} a ${customer.nombreEmpresa}?`)) return;
    this.api.estado(customer.id, customer.activo === false).subscribe({
      next: () => { this.notice = customer.activo === false ? 'Cliente activado.' : 'Cliente desactivado.'; this.recargar(false); },
      error: e => this.error = this.mensajeError(e),
    });
  }

  cancelar(): void { this.editingId = null; this.draft = this.vacio(); this.guardando = false; }

  recargar(showLoading = true): void {
    if (showLoading) this.cargando = true;
    this.api.listar().subscribe({
      next: data => { this.customers = data; this.cargando = false; },
      error: e => { this.error = this.mensajeError(e); this.cargando = false; this.guardando = false; },
    });
  }

  private vacio(): Customer { return { nombreEmpresa: '', paisDestino: '', personaContacto: '', email: '', telefono: '', direccionFiscal: '' }; }
  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) return 'No se pudo conectar con el backend. Revisa que esté activo y que permita solicitudes desde Angular.';
    if (error.status === 404) return 'La ruta de clientes no existe en el backend.';
    return error.error?.detail ?? error.error?.message ?? `El backend respondió con el estado ${error.status}.`;
  }
}
