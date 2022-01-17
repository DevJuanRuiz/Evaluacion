import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-menu-edicion',
  templateUrl: './menu-edicion.component.html',
  styleUrls: ['./menu-edicion.component.css']
})
export class MenuEdicionComponent implements OnInit {

  id: number;
  edicion: boolean;

  form: FormGroup;
  mensaje: string;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'icono': new FormControl(''),
      'url': new FormControl(''),
      'roles' : new FormControl('')
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.menuService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
            'id': new FormControl(data.idMenu),
            'nombre': new FormControl(data.nombre),
            'icono': new FormControl(data.icono),
            'url': new FormControl(data.url),
            'roles' : new FormControl(data.roles)
          });                      
      });
    }
  }


  operar(){
    let menu = new Menu();
    
    menu.idMenu = this.form.value['id'];
    menu.nombre = this.form.value['nombre'];
    menu.icono = this.form.value['icono'];
    menu.url = this.form.value['url'];
    menu.roles = this.form.value['roles']
    //signoVital.idPaciente = pacientesel.idPaciente;    
    if (this.edicion) {
      //MODIFICAR
      //PRACTICA COMUN, NO IDEAL
      this.menuService.modificar(menu).subscribe( () => {        
        this.menuService.listar().subscribe(data => {
          this.menuService.setMenuCambio(data);
          this.menuService.setMensajeCambio('SE MODIFICO');
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
      this.menuService.registrar(menu).pipe(switchMap( () => {
        return this.menuService.listar();
      }))
      .subscribe(data => {
        this.menuService.setMenuCambio(data);
        this.menuService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.router.navigate(['/pages/menu']);
  }


}
