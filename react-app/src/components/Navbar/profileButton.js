import { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../store/session';
import { useTheme } from '../../toggletheme';
import './profileButton.css'


function ProfileButton({ sessionUser }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [showMenu, setShowMenu] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const user = useSelector(state => state.session.user)

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;
        const closeMenu = () => {
            setShowMenu(false);
        };
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu])

    const loggingOut = async (e) => {
        e.preventDefault();
        let loggedOut = await dispatch(logout());

        return history.push('/')
    };

    const routeChange = () => {
        let path = `/users/${user.id}/posts`;
        history.push(path);
    }
    return (
        <div style={{ backgroundColor: theme.body, color: theme.text }}>
            {/* <ThemeApp/> */}
            <div className="navright-profile-div">
                <div className="profile-button-container">
                    <button onClick={openMenu} className="profile-dropdown">
                        <div className="icon-div">
                            <i className="fas fa-user-circle fa-2x" />
                            <i className="fas fa-angle-down fa-2x" />
                        </div>
                    </button>
                </div>
                {showMenu && sessionUser && (
                    <ul className="profile-details" style={{ backgroundColor: theme.body, color: theme.text, border: '2px solid white' }}
                    >
                        {/* <li className="profile-details-li">
                        <div>{sessionUser.firstname}</div>
                    </li> */}

                        <li className="profile-details-li">
                            <div className="profile-page" onClick={routeChange}>My Profile</div>
                        </li>
                        <li className="profile-details-li">
                            <div className="profile-page" onClick={toggleTheme}>
                                Dark Theme
                            </div>
                        </li>
                        <li className="profile-details-li">
                            <div className="signout-div" onClick={loggingOut}>Sign out</div>
                        </li>
                    </ul>
                )}
            </div>
        </div>


    )
}

export default ProfileButton;
