import { Component, OnInit } from '@angular/core';
import { LogInService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private logInService: LogInService
  ) { }

  ngOnInit() {
  }

  collapsed = true;
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  logOut(){
    Swal.fire({
      title: 'Favor de confirmar',
      text: "Cerrar sesión",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.logInService.logOut();
      }
    })
  }

}
