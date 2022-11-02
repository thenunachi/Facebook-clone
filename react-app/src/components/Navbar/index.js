import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './profileButton';

import './navbar.css'
import logo from './fakebook-high-resolution-color-logo-cropped.png'
import home from './home.png'

function NavBar({ loaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    return (
        <div className='navbar'>
            <div className='nav-left'>
                <NavLink exact to="/" className='home-link'>
                    <div className='logo-div'>
                        <img className="logo" src={logo} />
                    </div>
                    
                </NavLink>
            </div>
        <div className='middle'>
        <img className="home" src={home} />
        {/* <div className='homeSymbol'> <i class="fa-solid fa-house"></i></div> */}
        </div>
            <div className='nav-right'>
            {!sessionUser && (
                    <div className='login-signup'>
                       
                        <div onClick={() => setShowSignUpModal(true)} className='user-auth-div'>
                            <p className='user-auth-text'>Sign Up</p>
                        </div>
                    </div>
                )}
                {sessionUser && (
                    <ProfileButton sessionUser={sessionUser} />
                )}
            </div>
            
        </div>
    )
}

export default NavBar;
