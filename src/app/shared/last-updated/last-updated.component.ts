import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-last-updated',
  templateUrl: './last-updated.component.html',
  styleUrls: ['./last-updated.component.scss']
})
export class LastUpdatedComponent implements OnInit {
  lastUpdated: string = '';

  ngOnInit() {
    this.getLastUpdated();
  }

  getLastUpdated() {
    // Fake last modified date (actual date ko backend se fetch kar sakte hain)
    const lastModified = new Date(document.lastModified);
    this.lastUpdated = lastModified.toLocaleString(); // Local format
  }
}
