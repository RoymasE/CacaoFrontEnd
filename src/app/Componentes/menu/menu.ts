import { Component, OnInit } from '@angular/core';
import { Api } from '../../Servicios/api';





@Component({
  selector: 'app-menu',

  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  constructor(private api: Api) {}
  ngOnInit(): void {
    if (!localStorage.getItem('cacao_token')) return;
    this.api.get<any>('/auth/me').subscribe({next:user=>{
      const name=[user.nombre,user.apellido].filter(Boolean).join(' ') || user.username;
      if(name)localStorage.setItem('cacao_nombre',name);
      if(user.rol)localStorage.setItem('cacao_rol',user.rol);
    },error:()=>{}});
  }
  get username(): string { return localStorage.getItem('cacao_nombre') || ''; }
  get initials(): string { return this.username.split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase() || 'C'; }
  logout(): void { localStorage.removeItem('cacao_token'); localStorage.removeItem('cacao_nombre'); localStorage.removeItem('cacao_rol'); location.href = '/'; }
}
