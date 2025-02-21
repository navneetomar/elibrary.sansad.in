import { Injectable } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

// eslint-disable-next-line lodash/import-scope

@Injectable({
  providedIn: 'root',
})
export class CustomNgbDateParserFormatter extends NgbDateParserFormatter {
  isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
        return { year: this.toInteger(dateParts[0]), month: null, day: null };
      } else if (
        dateParts.length === 2 &&
        this.isNumber(dateParts[0]) &&
        this.isNumber(dateParts[1])
      ) {
        return {
          year: this.toInteger(dateParts[1]),
          month: this.toInteger(dateParts[0]),
          day: null,
        };
      } else if (
        dateParts.length === 3 &&
        this.isNumber(dateParts[0]) &&
        this.isNumber(dateParts[1]) &&
        this.isNumber(dateParts[2])
      ) {
        return {
          year: this.toInteger(dateParts[2]),
          month: this.toInteger(dateParts[1]),
          day: this.toInteger(dateParts[0]),
        };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date
      ? `${this.isNumber(date.day) ? this.padNumber(date.day) : ''}/${
          this.isNumber(date.month) ? this.padNumber(date.month) : ''
        }/${date.year}`
      : '';
  }
}
