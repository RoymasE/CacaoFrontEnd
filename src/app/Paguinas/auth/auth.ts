import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Api } from '../../Servicios/api';

@Component({selector:'app-auth',standalone:false,templateUrl:'./auth.html',styleUrl:'./auth.css'})
export class Auth {
  username=''; password=''; nombre=''; apellido=''; email=''; register=false; busy=false; error='';
  constructor(private api:Api,private router:Router,private route:ActivatedRoute){}
  submit():void {
    this.busy=true;this.error='';
    const request=this.register?this.api.post('/auth/register',{username:this.username,password:this.password,nombre:this.nombre,apellido:this.apellido,email:this.email,rol:'VENDEDOR'}):this.api.login(this.username,this.password);
    request.subscribe({next:(result:any)=>{
      if(this.register){this.register=false;this.password='';this.error='Cuenta creada. Inicia sesión con tus credenciales.';this.busy=false;return;}
      localStorage.setItem('cacao_token',result.token);localStorage.setItem('cacao_nombre',result.nombreCompleto||result.username);localStorage.setItem('cacao_rol',result.rol);this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl')||'/');
    },error:(e:HttpErrorResponse)=>{this.error=e.error?.message||`No se pudo completar la solicitud (${e.status}).`;this.busy=false;}});
  }
}
