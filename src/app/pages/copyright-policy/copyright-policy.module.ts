import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CopyrightPolicyComponent } from './copyright-policy.component';

const routes: Routes = [{ path: '', component: CopyrightPolicyComponent }];

@NgModule({
  declarations: [CopyrightPolicyComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CopyrightPolicyModule {}
