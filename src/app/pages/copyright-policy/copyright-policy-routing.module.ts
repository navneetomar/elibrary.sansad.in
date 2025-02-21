import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopyrightPolicyComponent } from './copyright-policy.component';

const routes: Routes = [{ path: '', component: CopyrightPolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyrightPolicyRoutingModule { }
