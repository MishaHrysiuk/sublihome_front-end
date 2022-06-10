import { Routes, Route, BrowserRouter, Navigate} from "react-router-dom";
import { MainPage, AboutUsPage, AdminPage, CartPage, ProductsPage, ProfilePage, SignUpPage, SignInPage, HomePage} from "../pages";
import React from "react";
import './app.scss'
import { authenticationService } from "../../services/auth-service";

const App = () => {
    return (
        <BrowserRouter>
             <Routes>
                <Route path="/" element={<MainPage />} >
                    <Route index element={<HomePage/>} />
                    <Route path="about_us" element={<AboutUsPage/>} />
                    <Route
                        path="profile"
                        element={!authenticationService.currentUserValue ? (
                            <Navigate replace to ='/sign_in'/>
                        ) : (<ProfilePage />)}
                    />
                    <Route path="products"
                        element={!authenticationService.currentUserValue ? (
                            <Navigate replace to ='/sign_in'/>
                        ) : (<ProductsPage />)}
                    />
                    <Route path="cart" element={!authenticationService.currentUserValue ? (
                            <Navigate replace to ='/sign_in'/>
                        ) : (<CartPage />)} />
                </Route>
                <Route path="sign_in"
                    element={authenticationService.currentUserValue ? (
                        <Navigate replace to ='/'/>
                    ) : (<SignInPage />)}
                />
                <Route path="sign_up"
                    element={authenticationService.currentUserValue ? (
                        <Navigate replace to ='/'/>
                    ) : (<SignUpPage />)}
                />
                <Route path="admin"
                    element={!authenticationService.currentUserIsAdmin ? (
                        <Navigate replace to ='/'/>
                    ) : (<AdminPage />)}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App