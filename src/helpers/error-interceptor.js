import { authenticationService } from "../services/auth-service";

export const errorInterceptor = (err) => {
    const { response } = err;
    if ([401, 403].includes(err.status)) {
        authenticationService.logout();
    } else if (!response) {
        alert(err);
    } else {
        alert(response.message ? response.message : `Error status ${err.status}`)
    }
}