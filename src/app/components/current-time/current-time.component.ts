import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'ds-current-time',
  templateUrl: './current-time.component.html',
  styleUrls: ['./current-time.component.scss']
})
export class CurrentTimeComponent implements OnInit {

  currentTime: string;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
      this.cdRef.detectChanges(); // Manually trigger change detection
    }, 1000);  // Update every second
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-GB', { hour12: false }); // 24-hour format
  }
}
