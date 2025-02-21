import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [{ path: '', component: ContactUsComponent }];

@NgModule({
  declarations: [ContactUsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ContactUsModule {}
