import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({selector:'app-sin-permiso',standalone:false,template:'<main class="auth-page"><section class="auth-card"><p class="eyebrow">ACCESO RESTRINGIDO</p><h1>Tu rol no tiene acceso a esta sección</h1><p>Si necesitas estos permisos, solicita el cambio a un administrador o gerente.</p><button type="button" (click)="inicio()">Volver al panel</button></section></main>',styles:['button{border:0;border-radius:5px;padding:12px;background:#315b40;color:#fff;cursor:pointer}']})
export class SinPermiso { constructor(private router:Router){} inicio():void{this.router.navigateByUrl('/');} }
