import { ReactHttpService } from './react-http.service';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Observable } from 'rxjs';
export class UdemyApiService extends ReactHttpService {

  domainUrl = 'https://www.udemy.com';
  businessAccount = false;

  constructor(props) {
    super(props);
    let currentUser = props.currentUser;
    if(!currentUser && props.location
          && props.location.state
          && props.location.state.currentUser) {
      currentUser = props.location.state.currentUser
    }
    //console.log(currentUser)
    if(currentUser && currentUser.businessAccount) {
      this.domainUrl = currentUser.businessDomainUrl;
      this.businessAccount = true;
    }
  }

  showAllCourses = () => {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses-collections/?collection_has_courses=True&fields[course]=@min,visible_instructors,image_240x135,image_480x270,favorite_time,archive_time,is_practice_test_course,completion_ratio,content_info,last_accessed_time,enrollment_time,features,published_title,remaining_time&fields[user_has_subscribed_courses_collection]=@all&page=1&page_size=100000`;

    if(this.businessAccount) {
      endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/?ordering=-last_accessed&fields[course]=@min,visible_instructors,image_240x135,favorite_time,archive_time,completion_ratio,last_accessed_time,enrollment_time,is_practice_test_course,features,num_collections,published_title,is_private,buyable_object_type&fields[user]=@min,job_title&page=1&page_size=100000`;
    }

    return this.get(endpointURL);

  }

  loadCourseItems(courseId) {
    let endpointURL = `${this.domainUrl}/api-2.0/courses/${courseId}/subscriber-curriculum-items?page_size=100000&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,last_watched_second,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,external_url,status,time_estimation`;
    return this.get(endpointURL);
  }

  loadCourseCompletionRatio(courseId) {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/${courseId}/progress?fields[course]=completion_ratio`;
    return this.get(endpointURL);
  }

  loadCompletedLectures(courseId) {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/${courseId}/progress?fields[course]=completed_lecture_ids,completed_quiz_ids,last_seen_page,completed_assignment_ids`;
    return this.get(endpointURL);
  }

  updateProgressLog(courseId, lectureId, totalLength, currentPosition) {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/progress-logs`;
    let progressLogData = [];
    let progressLog = {
      total: totalLength || 0,
      position: currentPosition || 0,
      openPanel: "default",
      isFullscreen: false,
      context: {
        type: "Lecture"
      }
    }
    progressLogData.push(progressLog);
    return this.post(endpointURL, progressLogData);
  }

  markCourse(courseId, lectureId, completed) {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/`;
    if(completed) {
      let requestBody = {
        lecture_id: lectureId,
        downloaded: false
      }
      this.post(endpointURL, requestBody).subscribe();
    }
    else {
      endpointURL = endpointURL + lectureId;
      this.delete(endpointURL).subscribe();
    }
  }

  loadLastVisitedLecture(courseId, user) {
    return new Observable(subscriber => {
      let endpointURL = `${this.domainUrl}/course-dashboard-redirect/?course_id=${courseId}`;
      this.jsxElectronUtil = new JsxElectronUtil();
      let data = {
        ...user,
        url: endpointURL
      }
      this.jsxElectronUtil.ipcRenderer.send('last-visited-lecture', data);
      this.jsxElectronUtil.ipcRenderer.on('lecture-redirect-url',(event, url)=>{
        subscriber.next(url);
        subscriber.complete();
      });
    });
  }

  loadLectureItems(courseId, lectureId) {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}??fields[lecture]=asset,description,download_url,is_free,last_watched_second&fields[asset]=asset_type,length,stream_urls,captions,thumbnail_url,thumbnail_sprite,slides,slide_urls,download_urls,data,title,filename`;
    return this.get(endpointURL);
  }

  resetCourseProgress(courseId) {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/${courseId}/progress`;
    let resetProgressBody = {
      mark_as_not_started: 1
    }
    this.post(endpointURL,resetProgressBody).subscribe();
  }

  getResourceUrl(courseId, lectureId, resourceId) {
    let endpointURL = `${this.domainUrl}/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/supplementary-assets/${resourceId}?fields[asset]=download_urls`;
    return this.get(endpointURL);
  }

  download(url, fileName) {
    this.jsxElectronUtil.save(url, fileName);
  }

}
