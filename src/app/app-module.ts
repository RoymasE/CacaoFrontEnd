import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Menu } from './Componentes/menu/menu';
import { Reguistros } from './Paguinas/reguistros/reguistros';
import { Productos } from './Paguinas/productos/productos';
import { Detalles } from './Paguinas/detalles/detalles';
import { Operacion } from './Paguinas/operacion/operacion';
import { Auth } from './Paguinas/auth/auth';
import { authInterceptor } from './Servicios/auth-interceptor';

@NgModule({
  declarations: [App, Menu, Reguistros, Productos, Detalles, Operacion, Auth],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}
