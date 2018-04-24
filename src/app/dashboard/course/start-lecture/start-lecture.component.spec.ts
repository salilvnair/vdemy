import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartLectureComponent } from './start-lecture.component';

describe('StartLectureComponent', () => {
  let component: StartLectureComponent;
  let fixture: ComponentFixture<StartLectureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartLectureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
