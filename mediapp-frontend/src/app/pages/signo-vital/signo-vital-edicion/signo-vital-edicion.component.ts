import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { SignoVital } from 'src/app/_model/signovital';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoVitalService } from 'src/app/_service/signo-vital.service';

@Component({
  selector: 'app-signo-vital-edicion',
  templateUrl: './signo-vital-edicion.component.html',
  styleUrls: ['./signo-vital-edicion.component.css']
})
export class SignoVitalEdicionComponent implements OnInit {
  id: number;
  edicion: boolean;

  form: FormGroup;
  pacientes: Paciente[];
  mensaje: string;

  //utiles para el autocomplete
  myControlPaciente: FormControl = new FormControl();

  pacientesFiltrados$: Observable<Paciente[]>;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  pacienteSeleccionado: Paciente;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private signoVitalService: SignoVitalService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'fecha': new FormControl(new Date()),
      'paciente': this.myControlPaciente,      
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });

    this.listarInicial();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.signoVitalService.listarPorId(this.id).subscribe(data => {
        //this.pacienteService.listarPorId(data.idPaciente).subscribe(pacientedata =>{
          //this.myControlPaciente = new FormControl(pacientedata);
          this.myControlPaciente = new FormControl(data.paciente)
          this.form = new FormGroup({
            'id': new FormControl(data.idSignoVital),
            'fecha': new FormControl(data.fecha),
            'paciente': this.myControlPaciente,
            'temperatura': new FormControl(data.temperatura),
            'pulso': new FormControl(data.pulso),
            'ritmo': new FormControl(data.ritmo)
          });  
        //});                      
      });
    }
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  listarInicial() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  mostrarPaciente(val: any) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  operar(){
    let signoVital = new SignoVital();
    let pacientesel = this.form.value['paciente'];
    
    signoVital.idSignoVital = this.form.value['id'];
    signoVital.fecha = this.form.value['fecha'];
    //signoVital.idPaciente = pacientesel.idPaciente;
    signoVital.paciente = pacientesel;
    signoVital.temperatura = this.form.value['temperatura'];
    signoVital.ritmo = this.form.value['ritmo'];
    signoVital.pulso = this.form.value['pulso'];
    console.log(signoVital)
    console.log(this.edicion)
    if (this.edicion) {
      //MODIFICAR
      //PRACTICA COMUN, NO IDEAL
      this.signoVitalService.modificar(signoVital).subscribe( () => {        
        this.signoVitalService.listar().subscribe(data => {
          this.signoVitalService.setSignoVitalCambio(data);
          this.signoVitalService.setMensajeCambio('SE MODIFICO');
        });
      });
    } else {
      //REGISTRAR 
      //PRACTICA IDEAL, OPERADORES REACTIVOS op switchMap
      // this.pacienteService.registrar(paciente).subscribe( () => {        
      //   this.pacienteService.listar().subscribe(data => {
      //     this.pacienteService.pacienteCambio.next(data);
      //     this.pacienteService.mensajeCambio.next('SE REGISTRO');
      //   });
      // });
      this.signoVitalService.registrar(signoVital).pipe(switchMap( () => {
        return this.signoVitalService.listar();
      }))
      .subscribe(data => {
        this.signoVitalService.setSignoVitalCambio(data);
        this.signoVitalService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.router.navigate(['/pages/signo-vital']);
  }
}
