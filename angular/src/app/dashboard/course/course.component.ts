import { Component, OnInit, Input } from '@angular/core';
import { CourseModel } from './model/course.model';
import { DashboardService } from '../service/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @Input() course: CourseModel;
  @Input() appMenu;
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {}

  playCourse(courseId) {
    //debugger;
    this.dashboardService.setPlayCourseId(courseId);
    this.router.navigate(['/play']);
  }

  isLocalImage(fileUrl:string){
    //console.log(fileUrl);
    if(fileUrl.indexOf('file://')>-1){
      return true;
    }
    return false;
  }
}
