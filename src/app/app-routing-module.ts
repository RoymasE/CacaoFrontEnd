import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth } from './Paguinas/auth/auth';
import { authGuard } from './Servicios/auth-guard';
import { Reguistros } from './Paguinas/reguistros/reguistros';
import { Detalles } from './Paguinas/detalles/detalles';
import { Operacion } from './Paguinas/operacion/operacion';
import { Productos } from './Paguinas/productos/productos';
import { SinPermiso } from './Paguinas/auth/sin-permiso';

const routes: Routes = [
  { path: '', component: Detalles, canActivate: [authGuard], data: {page:'resumen'} },
  { path: 'clientes', component: Reguistros, canActivate: [authGuard], data: {page:'clientes'} },
  { path: 'productos', component: Productos, canActivate: [authGuard], data: {page:'productos'} },
  { path: 'proveedores', component: Operacion, canActivate: [authGuard], data: {page:'proveedores'} },
  { path: 'usuarios', component: Operacion, canActivate: [authGuard], data: {page:'usuarios'} },
  { path: 'lotes', component: Operacion, canActivate: [authGuard], data: {page:'lotes'} },
  { path: 'cajones', component: Operacion, canActivate: [authGuard], data: {page:'cajones'} },
  { path: 'fermentacion', component: Operacion, canActivate: [authGuard], data: {page:'fermentacion'} },
  { path: 'secado', component: Operacion, canActivate: [authGuard], data: {page:'secado'} },
  { path: 'granos', component: Operacion, canActivate: [authGuard], data: {page:'granos'} },
  { path: 'derivados', component: Operacion, canActivate: [authGuard], data: {page:'derivados'} },
  { path: 'pedidos', component: Operacion, canActivate: [authGuard], data: {page:'pedidos'} },
  { path: 'packing', component: Operacion, canActivate: [authGuard], data: {page:'packing'} },
  { path: 'areas', component: Operacion, canActivate: [authGuard], data: {page:'areas'} },
  { path: 'balance', component: Operacion, canActivate: [authGuard], data: {page:'balance'} },
  { path: 'sin-permiso', component: SinPermiso },
  { path: 'acceso', component: Auth },
  { path: '**', redirectTo: '' },
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
