import { ReactHttpService } from './react-http.service';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Observable } from 'rxjs';
export class UdemyApiService extends ReactHttpService {

  showAllCourses = () => {
    let endpointURL = 'https://www.udemy.com/api-2.0/users/me/subscribed-courses-collections/?collection_has_courses=True&course_limit=9&fields[course]=@min,visible_instructors,image_240x135,image_480x270,favorite_time,archive_time,is_practice_test_course,completion_ratio,content_info,last_accessed_time,enrollment_time,features,published_title,remaining_time&fields[user_has_subscribed_courses_collection]=@all&page=1&page_size=8';
    return this.get(endpointURL);

  }

  loadCourseItems(courseId) {
    let endpointURL = "https://www.udemy.com/api-2.0"+
      `/courses/${courseId}/subscriber-curriculum-items?page_size=100000&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,last_watched_second,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,external_url,status,time_estimation`;
    return this.get(endpointURL);
  }

  loadCompletedLectures(courseId) {
    let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/progress?fields[course]=completed_lecture_ids,completed_quiz_ids,last_seen_page,completed_assignment_ids`;
    return this.get(endpointURL);
  }

  updateProgressLog(courseId, lectureId, totalLength, currentPosition) {
    let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/progress-logs`;
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
    let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/`;
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

  loadLastVisitedLecture(courseId, email) {
    return new Observable(subscriber => {
      let endpointURL = `https://www.udemy.com/course-dashboard-redirect/?course_id=${courseId}`;
      this.jsxElectronUtil = new JsxElectronUtil();
      let data = {
        email: email,
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
    let endpointURL = "https://www.udemy.com/api-2.0"+
    `/users/me/subscribed-courses/${courseId}/lectures/${lectureId}?fields[asset]=stream_urls,download_urls,title,filename,data`;
    return this.get(endpointURL);
  }

  resetCourseProgress(courseId) {
    let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/progress`;
    let resetProgressBody = {
      mark_as_not_started: 1
    }
    this.post(endpointURL,resetProgressBody).subscribe();
  }

  getResourceUrl(courseId, lectureId, resourceId) {
    let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/supplementary-assets/${resourceId}?fields[asset]=download_urls`;
    return this.get(endpointURL);
  }

}
