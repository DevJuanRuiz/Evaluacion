import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SignoVital } from 'src/app/_model/signovital';
import { SignoVitalService } from 'src/app/_service/signo-vital.service';

@Component({
  selector: 'app-signo-vital',
  templateUrl: './signo-vital.component.html',
  styleUrls: ['./signo-vital.component.css']
})
export class SignoVitalComponent implements OnInit {

  dataSource: MatTableDataSource<SignoVital>;
  displayedColumns: string[] = ['idSignoVital', 'fecha', 'nombres', 'apellidos', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number;


  constructor(
    private signoVitalService : SignoVitalService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.signoVitalService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.signoVitalService.getSignoVitalCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });*/
    
    this.signoVitalService.listarPageable(0, 10).subscribe(data => {
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
    this.signoVitalService.eliminar(idPaciente).subscribe(() => {
      this.signoVitalService.listar().subscribe(data => {
        this.signoVitalService.setSignoVitalCambio(data);
        this.signoVitalService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  mostrarMas(e: any){
    this.signoVitalService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  verificarHijos(){
    return this.route.children.length !== 0
  }
}
