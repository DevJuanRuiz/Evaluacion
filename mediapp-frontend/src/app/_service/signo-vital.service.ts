import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignoVital } from '../_model/signovital';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignoVitalService extends GenericService<SignoVital>{

  private signoVitalCambio = new Subject<SignoVital[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signovital`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignoVitalCambio() {
    return this.signoVitalCambio.asObservable();
  }

  setSignoVitalCambio(signoVital: SignoVital[]) {
    this.signoVitalCambio.next(signoVital);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
