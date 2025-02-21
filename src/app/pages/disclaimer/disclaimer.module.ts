import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DisclaimerComponent } from './disclaimer.component';

const routes: Routes = [{ path: '', component: DisclaimerComponent }];

@NgModule({
  declarations: [DisclaimerComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DisclaimerModule {}
