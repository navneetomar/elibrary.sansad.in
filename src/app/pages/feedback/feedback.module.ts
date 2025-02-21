import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './feedback.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: FeedbackComponent }];

@NgModule({
  declarations: [FeedbackComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
})
export class FeedbackModule {}
