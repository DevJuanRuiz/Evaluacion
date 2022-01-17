import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';
import { environment } from 'src/environments/environment';
import '../../../assets/login-animation.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
  }

  iniciarSesion(){
    //
    this.loginService.login(this.usuario, this.clave).subscribe(data=>{      
      //console.log(data);      
      /*
      tipos de cookies para almacenar datos
      sessionStorage -> almacena temporal siempre y cuando la pestaña o navegador se mantenga abierta
      localStorage -> por mas que el navegador o pestaña o reinicias la maquina sigue viviendo
      */
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['pages/inicio']);      
    });
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

}
