import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Capa } from 'src/app/models/capa.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CapaService } from 'src/app/services/capa.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-capas',
  templateUrl: './capas.component.html',
  styleUrls: ['./capas.component.css']
})
export class CapasComponent implements OnInit {

  public usuario: Usuario;
  public capas: Capa[];
  public displayedColumns = ['idCapa', 'nombre', 'icono', 'acciones'];
  public displayedColumnsMobile = ['idCapa', 'nombre', 'acciones'];
  public dataSource: MatTableDataSource<Capa>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;
  public image_url: string = `${environment.HOST}/api/capas/icono/`;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private capaService: CapaService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarCapas();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarCapas(page: number = 0, size: number = 10) {
    this.capaService.listarPaginado(page, size).subscribe(
      response => {
        this.capas = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.capas);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idCapa', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarCapas(e.pageIndex, e.pageSize);
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
        this.capaService.eliminar(id).subscribe(
          () => {
            this.cargarCapas();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

}
