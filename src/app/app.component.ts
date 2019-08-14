import { Component } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta) {

      this.setPageTitle().subscribe( event => {
        this.title.setTitle( environment.labels.prefixTitle + ' - ' + event.title );
        this.setMetaPage();
      });
  }

  private setPageTitle(): Observable<any> {
    return this.router.events
        .pipe(
          filter( event => event instanceof ActivationEnd ),
          filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
          map ( (event: ActivationEnd) => event.snapshot.data)
        );
  }

  private setMetaPage(): void {
    const metaTag: MetaDefinition = {
      name : 'description',
      content: this.title.getTitle()
    };

    this.meta.updateTag({ name: 'description', content: `Gobierno del Estado de Colima - Recibos de Nómina - Página [ ${this.title.getTitle()} ]` });
    this.meta.updateTag({ name: 'author', content: 'ICSIC - Gobierno del Estado de Colima [ XMAL ]' });
    this.meta.updateTag({ name: 'keywords', content: `GobCol, Recibo, Recibos, Nómina, Gobierno Colima, Colima, SAT, ${this.title.getTitle()}` });
  }

}
