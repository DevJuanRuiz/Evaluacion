import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rol } from '../_model/rol';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol> {

  private rolCambio = new Subject<Rol[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/roles`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getRolCambio() {
    return this.rolCambio.asObservable();
  }

  setRolCambio(rol: Rol[]) {
    this.rolCambio.next(rol);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
