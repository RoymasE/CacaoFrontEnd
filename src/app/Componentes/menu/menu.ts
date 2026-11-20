import { Component, OnInit } from '@angular/core';
import { Api } from '../../Servicios/api';
import { canAccessPage, ROLE_LABELS, AppRole } from '../../Servicios/roles';
import { Router } from '@angular/router';





@Component({
  selector: 'app-menu',

  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  readonly links = [
    {page:'resumen',path:'/',label:'Resumen'}, {page:'lotes',path:'/lotes',label:'Cosecha'},
    {page:'cajones',path:'/cajones',label:'Cajones'}, {page:'fermentacion',path:'/fermentacion',label:'Fermentación'},
    {page:'secado',path:'/secado',label:'Secado'}, {page:'productos',path:'/productos',label:'Inventario'},
    {page:'clientes',path:'/clientes',label:'Clientes'}, {page:'proveedores',path:'/proveedores',label:'Proveedores'},
    {page:'pedidos',path:'/pedidos',label:'Ventas'}, {page:'packing',path:'/packing',label:'Despachos'},
    {page:'usuarios',path:'/usuarios',label:'Usuarios'}, {page:'areas',path:'/areas',label:'Áreas'},
    {page:'balance',path:'/balance',label:'Balance'},
  ];
  constructor(private api: Api, private router: Router) {}
  ngOnInit(): void {
    if (!localStorage.getItem('cacao_token')) return;
    this.api.get<any>('/auth/me').subscribe({next:user=>{
      const name=[user.nombre,user.apellido].filter(Boolean).join(' ') || user.username;
      if(name)localStorage.setItem('cacao_nombre',name);
      if(user.rol)localStorage.setItem('cacao_rol',user.rol);
    },error:()=>{}});
  }
  get username(): string { return localStorage.getItem('cacao_nombre') || ''; }
  get role(): string { return localStorage.getItem('cacao_rol') || ''; }
  get roleLabel(): string { return ROLE_LABELS[this.role as AppRole] || this.role; }
  canSee(page: string): boolean { return !!this.username && canAccessPage(page, this.role); }
  get visibleLinks(): typeof this.links { return this.links.filter(link => this.canSee(link.page)); }
  get initials(): string { return this.username.split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase() || 'C'; }
  logout(): void { localStorage.removeItem('cacao_token'); localStorage.removeItem('cacao_nombre'); localStorage.removeItem('cacao_rol'); this.router.navigateByUrl('/acceso'); }
}
