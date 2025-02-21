import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HyperlinkingPolicyComponent } from './hyperlinking-policy.component';

const routes: Routes = [{ path: '', component: HyperlinkingPolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HyperlinkingPolicyRoutingModule { }
