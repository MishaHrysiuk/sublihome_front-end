import { BehaviorSubject } from 'rxjs';
import DefaultsAxios from '../helpers/jwt-interceptor';
import { AuthenticationService } from './sublihome-service';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const currentUserSubject = new BehaviorSubject(localStorage.getItem('currentUser'));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    currentUserId: currentUserSubject.value ? jwtDecode(currentUserSubject.value).UserId : null,
    currentUserIsAdmin: currentUserSubject.value ? jwtDecode(currentUserSubject.value).UserIsAdmin === 'True' : false,
    get currentUserValue () { return currentUserSubject.value }
};

function login(email, password) {
    const authClient = new AuthenticationService(axios.defaults.baseURL, DefaultsAxios);

    return authClient.login({
            email: email,
            password: password
        })
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            alert('Success')
            localStorage.setItem('currentUser', user);
            currentUserSubject.next(user);
            window.location.reload()

            return user;
        })
        .catch(err => {
            localStorage.removeItem('currentUser');
            currentUserSubject.next(null);
            window.location.reload()
            alert(err.response.message)
        })
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
    window.location.reload()
}
