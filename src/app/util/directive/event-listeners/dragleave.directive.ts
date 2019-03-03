import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[dragLeave]'
})
export class DragLeaveDirective {
  @Output() onDragLeave: EventEmitter<boolean> = new EventEmitter<false>();

  @HostListener('dragleave', ['$event'])
  public onListenerTriggered(event: any): void {
    this.onDragLeave.emit(true);
  }
}
