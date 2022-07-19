import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toNumber'
})
export class ToNumberPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    return Number(value) + Number (args);
  }

}
