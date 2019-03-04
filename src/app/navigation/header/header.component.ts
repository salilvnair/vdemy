import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '../../auth/service/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth: boolean;
  authSubsriciption: Subscription;
  highLightElement: string;
  @Output() sideNavToggle = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit() {
    this.highlightElementOnRoute();
    this.initAuthorization();
  }

  highlightElementOnRoute() {
    this.router.events.filter((event: any) => 
                    event instanceof NavigationEnd)
                    .subscribe(event => {
                      this.currentlyActive(event.url) 
                    });
  }
  
  initAuthorization() {
    this.authSubsriciption = this.authService.authChange.subscribe(
      authStatus => {
        this.isAuth = authStatus;
      }
    );
  }

  ngOnDestroy() {
    this.authSubsriciption.unsubscribe();
  }

  onToggleSidenav() {
    this.sideNavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  currentlyActive(id) {
    this.highLightElement = id;
  }
  
  getHighlightColor(id) {
    if (this.highLightElement && this.highLightElement === id) {
      return { color: "#3f51b5", "background-color": "white" };
    } else {
      return { color: "white", "background-color": "#3f51b5" };
    }
  }
}
