import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HyperlinkingPolicyComponent } from './hyperlinking-policy.component';

const routes: Routes = [{ path: '', component: HyperlinkingPolicyComponent }];

@NgModule({
  declarations: [HyperlinkingPolicyComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HyperlinkingPolicyModule {}
