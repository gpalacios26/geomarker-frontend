import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Dispositivo } from 'src/app/models/dispositivo.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DispositivoService } from 'src/app/services/dispositivo.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.css']
})
export class DispositivosComponent implements OnInit {

  public usuario: Usuario;
  public dispositivos: Dispositivo[];
  public displayedColumns = ['idDispositivo', 'codigo', 'nombre', 'acciones'];
  public displayedColumnsMobile = ['idDispositivo', 'codigo', 'acciones'];
  public dataSource: MatTableDataSource<Dispositivo>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private dispositivoService: DispositivoService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarDispositivos();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarDispositivos(page: number = 0, size: number = 10) {
    this.dispositivoService.listarPaginado(page, size).subscribe(
      response => {
        this.dispositivos = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.dispositivos);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idDispositivo', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarDispositivos(e.pageIndex, e.pageSize);
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
        this.dispositivoService.eliminar(id).subscribe(
          () => {
            this.cargarDispositivos();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

  exportar() {
    this.dispositivoService.exportar().subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'dispositivos.xlsx';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

}
