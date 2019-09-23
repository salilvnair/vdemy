import { ReactHttpClient } from '@salilvnair/react-httpclient';

export class ReactHttpService {
  sendCookiesInHeader = false;
  constructor(props) {
    this.props = props;
    let currentUser = this.props.currentUser;
    if(props.location
          && this.props.location.state
          && this.props.location.state.currentUser) {
      currentUser = this.props.location.state.currentUser
    }
    this.currentUser = currentUser;
    this.httpClient = new ReactHttpClient(this.requestInterceptor);
  }
  requestInterceptor = (request) => {
    let currentUser = this.currentUser;
    if(currentUser) {
        request.headers['Authorization'] = `Bearer ${currentUser.token}`;
        if(this.sendCookiesInHeader) {
          request.headers['Cookie'] = `${currentUser.cookie}`;
        }
    }
    return request;
  }

  get = (url, queryParams) => {
    return this.httpClient.get(url, queryParams);
  }

  post = (url, body, queryParams) => {
    return this.httpClient.post(url, body, queryParams);
  }

  put = (url, body, queryParams) => {
    return this.httpClient.put(url, body, queryParams);
  }

  delete = (url, queryParams) => {
    return this.httpClient.delete(url, queryParams);
  }

  patch = (url, body, queryParams) => {
    return this.httpClient.patch(url, body, queryParams);
  }
}
