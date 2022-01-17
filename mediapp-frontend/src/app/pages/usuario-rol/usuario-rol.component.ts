import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-usuario-rol',
  templateUrl: './usuario-rol.component.html',
  styleUrls: ['./usuario-rol.component.css']
})
export class UsuarioRolComponent implements OnInit {

  dataSource: MatTableDataSource<Usuario>;
  displayedColumns: string[] = ['idUsuario', 'username', 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number;


  constructor(
    private usuarioService : UsuarioService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.usuarioService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.usuarioService.getUsuarioCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });*/
    
    this.usuarioService.listarPageable(0, 10).subscribe(data => {
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
    this.usuarioService.eliminar(idPaciente).subscribe(() => {
      this.usuarioService.listar().subscribe(data => {
        this.usuarioService.setUsuarioCambio(data);
        this.usuarioService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  mostrarMas(e: any){
    this.usuarioService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  verificarHijos(){
    return this.route.children.length !== 0
  }

}
