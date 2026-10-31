import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Menu } from './Componentes/menu/menu';
import { Reguistros } from './Paguinas/reguistros/reguistros';
import { Productos } from './Paguinas/productos/productos';
import { Detalles } from './Paguinas/detalles/detalles';

@NgModule({
  declarations: [App, Menu, Reguistros, Productos, Detalles],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
