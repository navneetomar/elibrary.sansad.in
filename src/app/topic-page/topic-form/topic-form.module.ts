import { NgModule } from '@angular/core';

import { TopicFormComponent } from './topic-form.component';
import { SharedModule } from '../../shared/shared.module';
import { ComcolModule } from '../../shared/comcol/comcol.module';
import { FormModule } from '../../shared/form/form.module';

@NgModule({
  imports: [ComcolModule, FormModule, SharedModule],
  declarations: [TopicFormComponent],
  exports: [TopicFormComponent],
})
export class TopicFormModule {}
