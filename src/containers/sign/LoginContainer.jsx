import React, { useState, useRef } from 'react';
import 'uikit/dist/css/uikit.min.css';
import lofiImage from '../../assets/img/lofi.png';
import '../../styles.css';
import { useUser } from '../../contexts/UserContext';
import { Toast } from 'primereact/toast';

function LoginContainer({ onRegisterClick }) {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useRef(null);

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000" +'/User/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }

            const data = await response.json();
            const id_user = data.user_id;

            
            login({ id_user });

            
            window.location.href = '/control-panel';
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to log in', life: 3000 });
        }
    };

    return (
        <div className="uk-flex uk-position-center uk-height-1-1 uk-flex-center uk-flex-middle" style={{ width: "100vw" }}>
            <Toast ref={toast} />
            <div className="uk-card uk-card-default shadow-box uk-cover-container uk-width-1-2" style={{ backgroundColor: "#F2E9E1" }}>
                <div className="uk-flex">
                    <div className="uk-width-1-2 uk-height-max" style={{
                        backgroundImage: `url(${lofiImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}>
                    </div>
                    <div className="uk-width-1-2 form-section uk-padding-small">
                        <h1 className="uk-text-left uk-text-bold">Login</h1>
                        <div className="uk-form-controls uk-flex uk-flex-column">
                            <label className="uk-form-label uk-text-bold">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className='uk-margin-small uk-width-1-1'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="uk-form-controls uk-flex uk-flex-column">
                            <label className="uk-form-label uk-text-bold">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className='uk-margin-small uk-width-1-1'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="uk-padding-small">
                            <button
                                className="button-submit uk-width-1-1"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                        <div className="uk-padding-small">
                            <p className="uk-text-center">
                                Don't have an account? <a href="#" onClick={onRegisterClick} style={{ color: "var(--muted-olive)" }}>Register</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginContainer;
