//mat-dialog-element

export class Notifier {

  info(data, width) {
    let body = document.body;
    let mat = document.createElement('info-notifier');
    if(!mat) {
      mat = document.createElement('info-notifier');
    }
    mat['info']=data;
    if(width) {
      mat['width']=width;
    }
    body.appendChild(mat);
  }

  update(appUpadateStatus) {
    let body = document.body;
    let mat = document.querySelector('update-notifier');
    if(!mat) {
      mat = document.createElement('update-notifier');
      mat['data'] = {...appUpadateStatus};
      body.appendChild(mat);
    }
    else {
      mat.parentElement.removeChild(mat);
      mat = document.createElement('update-notifier');
      mat['data'] = {...appUpadateStatus};
      body.appendChild(mat);
    }
  }

  download(downloadnotifier, action) {
    let body = document.body;
    let mat = document.querySelector('download-notifier');
    if(!mat) {
      mat = document.createElement('download-notifier');
      mat['downloadnotifier'] = downloadnotifier;
      mat['action'] = action;
      body.appendChild(mat);
    }
    else {
      mat.parentElement.removeChild(mat);
      mat = document.createElement('download-notifier');
      mat['downloadnotifier'] = downloadnotifier;
      mat['action'] = action;
      body.appendChild(mat);
    }
  }

  on(selector, eventName, callback) {
    document.querySelector(selector).addEventListener(eventName,(event)=>{
      callback(event.detail,event);
    });
    return this;
  }

}

