import React, { useRef, useState, useEffect } from 'react';
import 'uikit/dist/css/uikit.min.css';
import '../../styles.css';
import './VerifyUser.css';
import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useUser } from '../../contexts/UserContext';

function VerifyLogin({ salt }) {
    const [segment1, setSegment1] = useState('');
    const [segment2, setSegment2] = useState('');
    const [segment3, setSegment3] = useState('');
    const [segment4, setSegment4] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const toast = useRef(null);
    const { login } = useUser();


    const handleConfirm = () => {
        const ipAddress = `${segment1}.${segment2}.${segment3}.${segment4}`;
        if (segment1 && segment2 && segment3 && segment4) {
            setIsButtonDisabled(true);
            fetch("http://localhost:5000" +'/User/verifyUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "salt": salt, "centralUrl": ipAddress })
            })
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'IP Verified Successfully.Redirecting to the control panel', life: 3000 });

                    fetch("http://localhost:5000" +'/User/loginWithSalt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ "salt": salt })
                    }).then(response => response.json())
                        .then(data => {
                            const id_user = data;
                            login({ id_user });

                            window.location.href = '/control-panel';
                        })
                        .catch(error => {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to redirect', life: 3000 });
                        });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to verify IP', life: 3000 });
                    setIsButtonDisabled(false);
                });
        } else {
            toast.current.show({ severity: 'warn', summary: 'Incomplete', detail: 'Please fill in all of the ip', life: 3000 });
        }
    };

    const customInput = ({ events, props }) => <input {...events} {...props} type="text" className="custom-otp-input" />;

    return (
        <div className="blurred-background uk-flex uk-flex-center uk-flex-middle uk-height-viewport">
            <Toast ref={toast} />
            <div className="shadow-box uk-card-body uk-width-1-2@m uk-align-center">
                <div style={{ backgroundColor: 'var(--warm-beige)' }}>
                    <h2 className="uk-text-bold" style={{ color: 'var(--deep-brown)', textAlign: 'center' }}>Verify your account</h2>
                    <p style={{ color: 'var(--deep-brown)', textAlign: 'center' }}>
                        To verify you account please enter the IP address that is displayed on the central controller screen
                    </p>

                    {}
                    <div className="uk-flex uk-flex-center uk-margin">
                        <InputOtp value={segment1} length={3} onChange={(e) => setSegment1(e.value)} inputTemplate={customInput} />
                        <span className="uk-margin-small-left uk-margin-small-right dot-separator">.</span>
                        <InputOtp value={segment2} length={3} onChange={(e) => setSegment2(e.value)} inputTemplate={customInput} />
                        <span className="uk-margin-small-left uk-margin-small-right dot-separator">.</span>
                        <InputOtp value={segment3} length={1} onChange={(e) => setSegment3(e.value)} inputTemplate={customInput} />
                        <span className="uk-margin-small-left uk-margin-small-right dot-separator">.</span>
                        <InputOtp value={segment4} length={2} onChange={(e) => setSegment4(e.value)} inputTemplate={customInput} />
                    </div>

                    {}
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
