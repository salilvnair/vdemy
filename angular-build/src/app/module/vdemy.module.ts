import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OverviewComponent } from '../dashboard/overview/overview.component';
import { PlayerComponent } from '../player/player.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { CourseComponent } from '../dashboard/course/course.component';
import { AddCourseComponent } from '../dashboard/course/add-course/add-course.component';
import { PlaylistComponent } from '../player/playlist/playlist.component';
import { HeaderComponent } from '../navigation/header/header.component';
import { SidenavComponent } from '../navigation/sidenav/sidenav.component';
import { EditCourseDialog } from '../dashboard/course/edit-course/edit-course-dialog';
import { VdemyRoutingModule } from '../route/vdemy.routing';
import { ExternalLibraryModules } from './external-library.module';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { PlayerDataService } from '../player/service/player-data.service';
import { SafeHtml } from '../util/pipe/safe-html.pipe';
import { OnRouterNavigateGuard } from '../util/router/service/router-navigate.guard';
import { CourseRepository } from '../dashboard/repository/course.repository';
import { DashboardDataService } from '../dashboard/service/dashboard-data.service';
import { ResumeCourseRepository } from '../dashboard/repository/resume-course.repository';
import { CoursePlayListStatusRepository } from '../player/repository/course-playlist-status.repository';
import { AppConfRepository } from '../config/repository/app-conf.repository';
import { ConfigComponent } from '../config/config.component';

const DECLRATATIONS_EXPORT_ARRAY = [
  DashboardComponent,
  OverviewComponent,
  PlayerComponent,
  NavigationComponent,
  CourseComponent,
  AddCourseComponent,
  EditCourseDialog,
  PlaylistComponent,
  HeaderComponent,
  SidenavComponent,
  ConfigComponent,
  SafeHtml
];

const IMPORT_EXPORT_MODULE_ARRAY = [
  BrowserModule,
  FormsModule,
  VdemyRoutingModule,
  ExternalLibraryModules
];

const ENTRY_COMPONENTS_ARRAY = [EditCourseDialog];

const PROVIDERS_ARRAY = [
  OnRouterNavigateGuard,
  DashboardService,
  PlayerDataService,
  CourseRepository,
  ResumeCourseRepository,
  CoursePlayListStatusRepository,
  AppConfRepository,
  DashboardDataService
];

@NgModule({
  declarations: [DECLRATATIONS_EXPORT_ARRAY],
  providers: [PROVIDERS_ARRAY],
  entryComponents: [ENTRY_COMPONENTS_ARRAY],
  imports: [IMPORT_EXPORT_MODULE_ARRAY],
  exports: [IMPORT_EXPORT_MODULE_ARRAY, DECLRATATIONS_EXPORT_ARRAY]
})
export class VdemyModule {}
