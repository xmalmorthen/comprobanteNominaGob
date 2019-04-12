import { NgModule } from '@angular/core';
import { UrlSanitizePipe } from './url-sanitize.pipe';

@NgModule({
  declarations: [
    UrlSanitizePipe
  ],
  exports: [
    UrlSanitizePipe
  ],
  imports: []
})
export class PipesModule { }
