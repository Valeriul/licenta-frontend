import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./DisplayIP.css"; // Ensure styling consistency

function decodeBase64Url(encoded) {
    try {
        const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(base64);
        const match = decoded.match(/^ws:\/\/([\d.]+):5002(\/ws)?$/);
        return match ? match[1] : null;
    } catch (error) {
        console.error("Invalid Base64 encoding:", error);
        return null;
    }
}

function DisplayIP() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useUser();
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get("uuid");
    const decodedIP = uuid ? decodeBase64Url(uuid) : null;
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        if (!uuid) return;

        const authenticateWithUUID = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/User/loginWithCentralUUID?uuid=${uuid}`);
                if(response.ok) {
                    const data = await response.json();
                    login(data);
                    navigate("/control-panel", { replace: true });
                }
            } catch (error) {
                console.error("Error during UUID authentication:", error);
                setIsAuthenticating(false);
            }
        };

        authenticateWithUUID();
    }, [uuid, navigate]);

    const ipSegments = decodedIP ? decodedIP.split(".") : ["", "", "", ""];

    return (
        <div className="ip-display-container">
            <p className="connected-text">{isAuthenticating ? "Connecting to device at:" : "Connected to device at:"}</p>
            <div className="ip-display">
                <span className="ip-segment">{ipSegments[0]}</span>
                <span className="dot-separator">.</span>
                <span className="ip-segment">{ipSegments[1]}</span>
                <span className="dot-separator">.</span>
                <span className="ip-segment">{ipSegments[2]}</span>
                <span className="dot-separator">.</span>
                <span className="ip-segment">{ipSegments[3]}</span>
            </div>
        </div>
    );
}

export default DisplayIP;
