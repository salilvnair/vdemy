import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  authSubsriciption: Subscription;

  @Output() closeSideNav = new EventEmitter<void>();

  isAuth: boolean;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.authSubsriciption.unsubscribe();
  }

  onCloseSideNav() {
    this.closeSideNav.emit();
  }
}
