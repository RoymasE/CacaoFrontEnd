import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sin-permiso',
  standalone: false,
  template: `
    <main class="cacao-page-container sin-permiso-page">
      <div class="cacao-card sin-permiso-card">
        <div class="icon-wrap">
          <span class="material-symbols-outlined">lock</span>
        </div>
        <span class="cacao-badge badge-rose">Acceso Restringido</span>
        <h1>Permisos Insuficientes</h1>
        <p>Tu rol de usuario actual no cuenta con las autorizaciones requeridas para acceder a esta sección del sistema agroindustrial.</p>
        <p class="sub-hint">Si requieres acceso operativo a este módulo, por favor comunícate con un Administrador o con la Gerencia para actualizar tus permisos.</p>
        <div class="action-row">
          <button type="button" class="btn btn-primary" (click)="inicio()">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Volver al Panel Principal</span>
          </button>
        </div>
      </div>
    </main>
  `,
  styles: [
    `
      .sin-permiso-page {
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sin-permiso-card {
        max-width: 480px;
        width: 100%;
        padding: 40px 32px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 18px;
        box-shadow: var(--shadow-lg);
      }
      .icon-wrap {
        width: 60px;
        height: 60px;
        border-radius: 16px;
        background: var(--rose-50);
        color: var(--rose-600);
        display: grid;
        place-items: center;
        margin-bottom: 16px;
        border: 1px solid var(--rose-100);
      }
      .icon-wrap .material-symbols-outlined {
        font-size: 32px;
      }
      h1 {
        font-family: var(--font-serif);
        font-size: 26px;
        font-weight: 700;
        color: var(--primary-900);
        margin: 14px 0 10px;
      }
      p {
        font-size: 13.5px;
        color: var(--gray-600);
        line-height: 1.6;
        margin: 0 0 10px;
      }
      .sub-hint {
        font-size: 12px;
        color: var(--gray-400);
        margin-bottom: 24px;
      }
      .action-row {
        width: 100%;
      }
      .action-row .btn {
        width: 100%;
      }
    `,
  ],
})
export class SinPermiso {
  constructor(private router: Router) {}
  inicio(): void {
    this.router.navigateByUrl('/');
  }
}
