import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-menu-rol',
  templateUrl: './menu-rol.component.html',
  styleUrls: ['./menu-rol.component.css']
})
export class MenuRolComponent implements OnInit {

  dataSource: MatTableDataSource<Menu>;
  displayedColumns: string[] = ['idMenu', 'nombre', 'icono', 'url', 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number;


  constructor(
    private menuService : MenuService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.menuService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.menuService.getMenuCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });*/
    
    this.menuService.listarPageable(0, 10).subscribe(data => {
      console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });    
  }

  filtrar(e: any){
    //console.log(e.target.value)
    this.dataSource.filterPredicate = (data: any, filter) => { const dataStr =JSON.stringify(data).toLowerCase(); return dataStr.indexOf(filter) != -1; }  
    this.dataSource.filter = e.target.value.trim().toLowerCase(); 
  }

  eliminar(idPaciente: number){
    this.menuService.eliminar(idPaciente).subscribe(() => {
      this.menuService.listar().subscribe(data => {
        this.menuService.setMenuCambio(data);
        this.menuService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  mostrarMas(e: any){
    this.menuService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  verificarHijos(){
    return this.route.children.length !== 0
  }

}
