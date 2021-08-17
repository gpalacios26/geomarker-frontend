import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Ubicacion } from 'src/app/models/ubicacion.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit {

  public usuario: Usuario;
  public ubicaciones: Ubicacion[];
  public displayedColumns = ['idUbicacion', 'titulo', 'direccion', 'acciones'];
  public displayedColumnsMobile = ['idUbicacion', 'titulo', 'acciones'];
  public dataSource: MatTableDataSource<Ubicacion>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private ubicacionService: UbicacionService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarUbicaciones();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarUbicaciones(page: number = 0, size: number = 10) {
    this.ubicacionService.listarPaginado(page, size).subscribe(
      response => {
        this.ubicaciones = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.ubicaciones);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idCapa', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarUbicaciones(e.pageIndex, e.pageSize);
  }

  eliminar(id: number) {
    const confirmDialog = this.dialog.open(DialogConfirmComponent, {
      disableClose: true,
      data: {
        titulo: 'Alerta',
        mensaje: 'Deseas eliminar el registro seleccionado?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.ubicacionService.eliminar(id).subscribe(
          () => {
            this.cargarUbicaciones();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

}
