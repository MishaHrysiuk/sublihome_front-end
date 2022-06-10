import axios from 'axios';

import { authenticationService } from '../services/auth-service';

const DefaultsAxios = axios.create();

export function jwtInterceptor() {
    DefaultsAxios.interceptors.request.use(
        (request) => {
            // add auth header with jwt if account is logged in and request is to the api url
            const account = authenticationService.currentUserValue;
            const isLoggedIn = account;
            // const isApiUrl = request.url.startsWith(env.REACT_APP_API_URL);
            const isApiUrl = true;

            if (isLoggedIn && isApiUrl) {
                request.headers.Authorization = `Bearer ${account}`;
            }

            return request;
        },
        (error) => {
            debugger
            const { response } = error;
            if (!response) {
                // network error
                console.error(error);
                return;
            }
        
            if ([401, 403].includes(response.status) && authenticationService.accountValue) {
                // auto logout if 401 or 403 response returned from api
                authenticationService.logout();
            }

            const errorMessage = response.data?.message || response.statusText;
            console.error('ERROR:', errorMessage);
        }
    );
}

export default DefaultsAxios;