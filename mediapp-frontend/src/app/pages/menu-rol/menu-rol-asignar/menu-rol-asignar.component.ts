import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Menu } from 'src/app/_model/menu';
import { Rol } from 'src/app/_model/rol';
import { MenuService } from 'src/app/_service/menu.service';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-menu-rol-asignar',
  templateUrl: './menu-rol-asignar.component.html',
  styleUrls: ['./menu-rol-asignar.component.css']
})
export class MenuRolAsignarComponent implements OnInit {
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
    private menuService: MenuService,
    private rolService: RolService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl('')
    });

    this.listarInicial();

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.initForm();
    });
  }

  initForm() {    
    this.menuService.listarPorId(this.id).subscribe(data => {
      this.form = new FormGroup({
          'id': new FormControl(data.idMenu),
          'nombre': new FormControl(data.nombre)
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
    let menu = new Menu();
    
    menu.idMenu = this.form.value['id'];
    menu.nombre = this.form.value['nombre'];
    menu.roles = this.dataSourceRolNuevo.data;
    
    console.log(menu)
      //MODIFICAR
      //PRACTICA COMUN, NO IDEAL
      this.menuService.asignarRoles(menu).subscribe( () => {        
        this.menuService.listar().subscribe(data => {
          this.menuService.setMenuCambio(data);
          this.menuService.setMensajeCambio('Se asignaron los roles.');
        });
      });
    this.router.navigate(['/pages/menu-rol']);
  }
}
