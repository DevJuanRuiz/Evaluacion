import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Rol } from 'src/app/_model/rol';
import { Usuario } from 'src/app/_model/usuario';
import { RolService } from 'src/app/_service/rol.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-usuario-rol-asignar',
  templateUrl: './usuario-rol-asignar.component.html',
  styleUrls: ['./usuario-rol-asignar.component.css']
})
export class UsuarioRolAsignarComponent implements OnInit {

  id: number;
  form: FormGroup;

  roles$: Observable<Rol[]>;
  rolSeleccionado: Rol;

  dataSourceRolNuevo: MatTableDataSource<Rol>;
  displayedColumnsRolNuevo: string[] = ['idRol', 'nombre', 'acciones'];

  dataSourceRolActual: MatTableDataSource<Rol>;
  displayedColumnsRolActual: string[] = ['idRol', 'nombre'];

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'username': new FormControl('')
    });

    this.listarInicial();

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.initForm();
    });
  }

  initForm() {    
    this.usuarioService.listarPorId(this.id).subscribe(data => {
      this.form = new FormGroup({
          'id': new FormControl(data.idUsuario),
          'username': new FormControl(data.username)
        });      
        this.dataSourceRolNuevo=new MatTableDataSource(data.roles);                
        this.dataSourceRolActual=new MatTableDataSource(data.roles);
    });    
  }
  listarInicial() {
    //this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.roles$ = this.rolService.listar();
  }

  agregarRol(){
    if (this.rolSeleccionado) {
      let cont = 0;
      // console.log(this.dataSourceRolNuevo)
      for (let i = 0; i < this.dataSourceRolNuevo.data.length; i++) {
        let rol = this.dataSourceRolNuevo.data[i];
        if (rol.idRol === this.rolSeleccionado.idRol) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        this.snackBar.open('El rol ya existe.', 'Aviso', { duration: 2000 });
      } else {
        this.dataSourceRolNuevo.data.push(this.rolSeleccionado);  
        this.dataSourceRolNuevo.filter = "";
      }
      

    }
  }
  eliminarRol(idRol: number){
    let index: number = this.dataSourceRolNuevo.data.findIndex(d => d.idRol === idRol);
    this.dataSourceRolNuevo.data.splice(index, 1);
    this.dataSourceRolNuevo._updateChangeSubscription()
  }

  guardar(){
    let usuario = new Usuario();
    
    usuario.idUsuario = this.form.value['id'];
    usuario.username = this.form.value['username'];
    usuario.enabled = true;
    usuario.roles = this.dataSourceRolNuevo.data;
    
    console.log(usuario)
      //MODIFICAR
      //PRACTICA COMUN, NO IDEAL
      this.usuarioService.asignarRoles(usuario).subscribe( () => {        
        this.usuarioService.listar().subscribe(data => {
          this.usuarioService.setUsuarioCambio(data);
          this.usuarioService.setMensajeCambio('Se asignaron los roles.');
        });
      });
    this.router.navigate(['/pages/usuario-rol']);
  }

}
