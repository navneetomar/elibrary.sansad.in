import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ds-current-date',
  templateUrl: './current-date.component.html',
  styleUrls: ['./current-date.component.scss']
})
export class CurrentDateComponent implements OnInit {
  currentDate: string;

  ngOnInit(): void {
    this.currentDate = this.getFormattedDate();
  }

  private getFormattedDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  }
}
