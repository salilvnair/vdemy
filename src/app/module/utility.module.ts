import { NgModule } from '@angular/core';
import { DragLeaveDirective } from '../util/directive/event-listeners/dragleave.directive';

const DECLRATATIONS_EXPORT_ARRAY = [DragLeaveDirective];

@NgModule({
  declarations: [DECLRATATIONS_EXPORT_ARRAY],
  exports: [DECLRATATIONS_EXPORT_ARRAY]
})
export class UtilityModule {}
