import React from 'react';
import { ReactHttpClient } from '@salilvnair/react-httpclient';

const withHttpInterceptor = (currentUser) => (ChildComponent) => {
    class ComposedComponent extends React.Component {
        httpClient;
        requestInterceptor = (request) => {
            if(currentUser) {
                request.headers['Authorization'] = `Bearer ${currentUser.token}`;
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
