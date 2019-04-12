import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'urlSanitize'
})
export class UrlSanitizePipe implements PipeTransform {

  constructor(
    private sanitized: DomSanitizer
  ){}

  transform(value: string): any {
    return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }

}
