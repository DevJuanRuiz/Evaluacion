import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-rol-edicion',
  templateUrl: './rol-edicion.component.html',
  styleUrls: ['./rol-edicion.component.css']
})
export class RolEdicionComponent implements OnInit {
  id: number;
  edicion: boolean;

  form: FormGroup;
  mensaje: string;

 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl('')
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.rolService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
            'id': new FormControl(data.idRol),
            'nombre': new FormControl(data.nombre),
            'descripcion': new FormControl(data.descripcion)
          });                      
      });
    }
  }


  operar(){
    let rol = new Rol();
    
    rol.idRol = this.form.value['id'];
    rol.nombre = this.form.value['nombre'];
    rol.descripcion = this.form.value['descripcion'];
    //signoVital.idPaciente = pacientesel.idPaciente;    
    if (this.edicion) {
      //MODIFICAR
      //PRACTICA COMUN, NO IDEAL
      this.rolService.modificar(rol).subscribe( () => {        
        this.rolService.listar().subscribe(data => {
          this.rolService.setRolCambio(data);
          this.rolService.setMensajeCambio('SE MODIFICO');
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
      this.rolService.registrar(rol).pipe(switchMap( () => {
        return this.rolService.listar();
      }))
      .subscribe(data => {
        this.rolService.setRolCambio(data);
        this.rolService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.router.navigate(['/pages/rol']);
  }

}
