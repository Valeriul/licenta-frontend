import React from 'react';
import { useUser } from '../../contexts/UserContext';
import '../../styles.css';
import 'uikit/dist/css/uikit.min.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Navbar.css';
import logo from '../../assets/img/logo.png';

function Navbar() {
    const { user, logout } = useUser();

    return (
        <nav className="navbar uk-navbar-container uk-navbar" uk-navbar="true">
            <div className="uk-navbar-left">
                <a href="/" className="uk-navbar-item uk-logo">
                    <img
                        src={logo}
                        alt="logo"
                        width={70}
                        style={{
                            padding: "5px",
                            backgroundColor: "#e4b48c",
                            borderRadius: "10px",
                        }}
                    />
                </a>
            </div>
            
            <div className="uk-navbar-right">
                {user ? (
                    <>
                        {}
                        <a href="/control-panel" className="uk-button uk-button-text navigator">
                            Control Panel
                        </a>
                        <button
                            className="uk-button uk-button-primary uk-margin-left"
                            onClick={logout}
                            style={{borderRadius:'10px'}}
                        >
                            <i className="pi pi-sign-out"></i> Logout
                        </button>
                    </>
                ) : (
                    <>
                        {}
                        <a href="/login" className="uk-button uk-button-secondary uk-margin-right"
                        style={{borderRadius:'10px'}}>
                            <i className="pi pi-sign-in"></i> Login
                        </a>
                        <a href="/register" className="uk-button uk-button-primary" style={{borderRadius:'10px'}}>
                            <i className="pi pi-user-plus"></i> Register
                        </a>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
