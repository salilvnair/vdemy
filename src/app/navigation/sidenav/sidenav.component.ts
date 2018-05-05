import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/service/auth.service';
import { TimeoutDialogService } from '../../auth/timeout/timeout-dialog.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  authSubsriciption: Subscription;

  @Output() closeSideNav = new EventEmitter<void>();

  isAuth: boolean;

  constructor(
    private authService: AuthService,
    private timeoutDialogService: TimeoutDialogService
  ) {}

  ngOnInit() {
    this.authSubsriciption = this.authService.authChange.subscribe(
      authStatus => {
        this.isAuth = authStatus;
      }
    );
  }

  ngOnDestroy() {
    this.authSubsriciption.unsubscribe();
  }

  onCloseSideNav() {
    this.closeSideNav.emit();
  }

  onLogout() {
    //this.timeoutDialogService.pauseOrContinueTimeOut(true);
    this.onCloseSideNav();
    this.authService.logout();
  }
}
