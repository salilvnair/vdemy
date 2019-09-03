import React from 'react';
import { ReactHttpClient } from '@salilvnair/react-httpclient';

const withHttpInterceptor = (ChildComponent) => {
    class ComposedComponent extends React.Component {
        httpClient;
        requestInterceptor = (request) => {
            if(this.props.currentUser) {
                request.headers['Authorization'] = `Bearer ${this.props.currentUser.token}`;
            }
            return request;
        }

        componentDidMount () {
          this.httpClient = new ReactHttpClient(this.requestInterceptor);
        }

        get = (url, queryParams) => {
            return this.httpClient.get(url, queryParams);
        }

        post = (url, body, queryParams) => {
            return this.httpClient.post(url, body, queryParams);
        }

        render() {
          console.log(this.props);
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
