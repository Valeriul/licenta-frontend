import React, { useState, useEffect } from "react";
import '../../styles.css';
import 'uikit/dist/css/uikit.min.css';
import { Button } from 'primereact/button';

function InfoSentEmailContainer({ email }) {

    const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(true);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setIsResendButtonDisabled(false);
        }
    }, [timer]);

    const handleResendEmailVerification = (email) => {
        fetch("http://localhost:5000" +'/Mail/sendVerificationEmail', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
        });
        setIsResendButtonDisabled(true);
    };

    return <><h1 className="uk-text-left uk-text-bold">Email Verification</h1>
        <p className="uk-text-center">An email verification has been sent to your email address. Please verify your email address to complete the registration process.</p>
        <div className="uk-padding-small">
            {}
            <Button
                label="Resend Verification Email"
                className="button-submit uk-width-1-1"
                disabled={isResendButtonDisabled}
                onClick={() => handleResendEmailVerification(email)}
            />

            {isResendButtonDisabled && (
                <p style={{ color: 'var(--deep-brown)', textAlign: 'center', marginTop: '10px' }}>
                    You can resend the email in {timer} seconds.
                </p>
            )}
        </div>
    </>;
}

export default InfoSentEmailContainer;