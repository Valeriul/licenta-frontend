import React, { useRef, useState } from 'react';
import 'uikit/dist/css/uikit.min.css';
import '../../styles.css';
import './VerifyUser.css';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useUser } from '../../contexts/UserContext';

function VerifyLogin({ salt }) {
    const [segment1, setSegment1] = useState('');
    const [segment2, setSegment2] = useState('');
    const [segment3, setSegment3] = useState('');
    const [segment4, setSegment4] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isValidIp, setIsValidIp] = useState(true);
    const toast = useRef(null);
    const { login } = useUser();

    const validateIp = () => {
        const ipAddress = `${segment1}.${segment2}.${segment3}.${segment4}`;
        const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;

        if (ipv4Pattern.test(ipAddress)) {
            setIsValidIp(true);
            return ipAddress;
        } else {
            setIsValidIp(false);
            return null;
        }
    };

    const handleConfirm = () => {
        const ipAddress = validateIp();

        if (!ipAddress) {
            toast.current.show({ severity: 'warn', summary: 'Invalid IP', detail: 'Enter a valid IPv4 address.', life: 3000 });
            return;
        }

        setIsButtonDisabled(true);
        fetch(process.env.REACT_APP_API_URL + '/User/verifyUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "salt": salt, "centralUrl": ipAddress })
        })
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'IP Verified Successfully. Redirecting...', life: 3000 });

                return fetch(process.env.REACT_APP_API_URL + '/User/loginWithSalt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "salt": salt })
                });
            })
            .then(response => response.json())
            .then(data => {
                login({ id_user: data });
                window.location.href = '/control-panel';
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to verify IP', life: 3000 });
                setIsButtonDisabled(false);
            });
    };

    return (
        <div className="blurred-background uk-flex uk-flex-center uk-flex-middle uk-height-viewport">
            <Toast ref={toast} />
            <div className="shadow-box uk-card-body uk-width-1-2@m uk-align-center">
                <div style={{ backgroundColor: 'var(--warm-beige)' }}>
                    <h2 className="uk-text-bold" style={{ color: 'var(--deep-brown)', textAlign: 'center' }}>Verify your account</h2>
                    <p style={{ color: 'var(--deep-brown)', textAlign: 'center' }}>
                        To verify your account, please enter the IP address displayed on the central controller screen.
                    </p>

                    {/* IP Input Fields */}
                    <div className="ip-input-container uk-flex uk-flex-center uk-margin">
                        <input
                            type="text"
                            className={`ip-segment ${!isValidIp ? 'input-error' : ''}`}
                            maxLength="3"
                            value={segment1}
                            onChange={(e) => setSegment1(e.target.value.replace(/\D/g, ''))}
                        />
                        <span className="dot-separator">.</span>
                        <input
                            type="text"
                            className={`ip-segment ${!isValidIp ? 'input-error' : ''}`}
                            maxLength="3"
                            value={segment2}
                            onChange={(e) => setSegment2(e.target.value.replace(/\D/g, ''))}
                        />
                        <span className="dot-separator">.</span>
                        <input
                            type="text"
                            className={`ip-segment ${!isValidIp ? 'input-error' : ''}`}
                            maxLength="3"
                            value={segment3}
                            onChange={(e) => setSegment3(e.target.value.replace(/\D/g, ''))}
                        />
                        <span className="dot-separator">.</span>
                        <input
                            type="text"
                            className={`ip-segment ${!isValidIp ? 'input-error' : ''}`}
                            maxLength="3"
                            value={segment4}
                            onChange={(e) => setSegment4(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>

                    {/* Confirm Button */}
                    <Button
                        label="Confirm"
                        className="button-submit uk-width-1-1 uk-margin-small-bottom"
                        onClick={handleConfirm}
                        disabled={isButtonDisabled}
                    />

                    <p style={{ color: 'var(--deep-brown)', textAlign: 'center', marginTop: '20px' }}>
                        If you have any issues, please contact us at <a href="mailto:stefanuta82@gmail.com" style={{ color: 'var(--soft-amber)' }}>stefanuta82@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VerifyLogin;
