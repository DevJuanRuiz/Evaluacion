import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  dataSource: MatTableDataSource<Rol>;
  displayedColumns: string[] = ['idRol', 'nombre', 'descripcion', 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number;


  constructor(
    private rolService : RolService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.rolService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.rolService.getRolCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });*/
    
    this.rolService.listarPageable(0, 10).subscribe(data => {
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
    this.rolService.eliminar(idPaciente).subscribe(() => {
      this.rolService.listar().subscribe(data => {
        this.rolService.setRolCambio(data);
        this.rolService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  mostrarMas(e: any){
    this.rolService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  verificarHijos(){
    return this.route.children.length !== 0
  }

}
