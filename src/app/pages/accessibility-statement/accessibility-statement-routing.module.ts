import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessibilityStatementComponent } from './accessibility-statement.component';

const routes: Routes = [{ path: '', component: AccessibilityStatementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessibilityStatementRoutingModule { }
