import React from 'react';
import { ReactHttpClient } from '@salilvnair/react-httpclient';

const withHttpInterceptor  = (ChildComponent) => {
    class ComposedComponent extends React.Component {
        httpClient;
        requestInterceptor = (request) => {
          let currentUser = this.props.currentUser;
          if(this.props.location
                && this.props.location.state
                && this.props.location.state.currentUser) {
            currentUser = this.props.location.state.currentUser
          }
          if(currentUser) {
              request.headers['Authorization'] = `Bearer ${currentUser.token}`;
          }
          return request;
        }

        componentDidMount () {
          this.httpClient = new ReactHttpClient(this.requestInterceptor);
        }

        get = (url, queryParams) => {
          if(!this.httpClient) {
            this.httpClient = new ReactHttpClient(this.requestInterceptor);
          }
          return this.httpClient.get(url, queryParams);
        }

        post = (url, body, queryParams) => {
          if(!this.httpClient) {
            this.httpClient = new ReactHttpClient(this.requestInterceptor);
          }
          return this.httpClient.post(url, body, queryParams);
        }

        render() {
            return (
            <ChildComponent
                    get={(url, queryParams) => this.get(url, queryParams)}
                    post={(url, body, queryParams) => this.post(url, body, queryParams)}
                    {...this.props} />
            );
        }
    }
    return ComposedComponent;
}

export default withHttpInterceptor;
