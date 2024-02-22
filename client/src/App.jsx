import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import About from './pages/About'
import CreateListing from './pages/CreateListing'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path="/" Component={Home} />
                <Route exact path="/sign-in" Component={SignIn} />
                <Route exact path="/sign-up" Component={SignUp} />
                <Route exact path="/about" Component={About} />
                <Route exact path="/listing/:listingId" Component={Listing} />

                <Route Component={PrivateRoute}>
                    <Route exact path="/profile" Component={Profile} />
                    <Route
                        exact
                        path="/create-listing"
                        Component={CreateListing}
                    />
                    <Route
                        exact
                        path="/update-listing/:listingId"
                        Component={UpdateListing}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
