import { BehaviorSubject } from 'rxjs';
import DefaultsAxios from '../helpers/jwt-interceptor';
import { AuthenticationService } from './sublihome-service';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const currentUserSubject = new BehaviorSubject(localStorage.getItem('currentUser'));

export const authenticationService = {
    login,
    logout,
    isLoggedIn: isLoggedIn(),
    currentUser: currentUserSubject.asObservable(),
    currentUserId: currentUserSubject.value ? jwtDecode(currentUserSubject.value).UserId : null,
    currentUserIsAdmin: currentUserSubject.value ? jwtDecode(currentUserSubject.value).UserIsAdmin === 'True' : false,
    get currentUserValue () { return currentUserSubject.value }
};

function isLoggedIn() {
    try {
        const obj = jwtDecode(currentUserSubject.value);
        return Object.keys(obj).every(i => ['UserEmail','UserId','UserIsAdmin', 'iss', 'exp', 'aud'].includes(i))
    }
    catch (err) {
        return false
    }

}

async function login(email, password) {
    const authClient = new AuthenticationService(axios.defaults.baseURL);

    try {
        const user = await authClient.login({
            email: email,
            password: password
        });
        localStorage.setItem('currentUser', user);
        currentUserSubject.next(user);
        window.location.reload();
        return user;
    } catch (err) {
        localStorage.removeItem('currentUser');
        currentUserSubject.next(null);
        window.location.reload();
        alert('Невірний логін або пароль');
    }
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
    window.location.reload()
}
