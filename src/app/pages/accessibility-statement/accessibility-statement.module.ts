import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccessibilityStatementComponent } from './accessibility-statement.component';

const routes: Routes = [{ path: '', component: AccessibilityStatementComponent }];

@NgModule({
  declarations: [AccessibilityStatementComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AccessibilityStatementModule {}
