import axios from 'axios';

import { authenticationService } from '../services/auth-service';

const DefaultsAxios = axios.create();

export function jwtInterceptor() {
    DefaultsAxios.interceptors.request.use(
        (request) => {
            const account = authenticationService.currentUserValue;
            const isLoggedIn = account;
            if (isLoggedIn) {
                request.headers.Authorization = `Bearer ${account}`;
            }
            return request;
        },
        (error) => {
            debugger
            const { response } = error;
            if (!response) {
                console.error(error);
                return;
            }
            if ([401, 403].includes(response.status) && authenticationService.currentUserValue()) {
                authenticationService.logout();
            }
        }
    );
}

export default DefaultsAxios;