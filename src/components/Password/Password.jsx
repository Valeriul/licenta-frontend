
import React, { useState } from "react";
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { FloatLabel } from "primereact/floatlabel";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import './Password.css';

export default function CPassword({value, onChange}) {
    const [password, setPassword] = useState(value);
    const footer = (
        <>
            <Divider />
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </>
    );

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        onChange(e);
    }

    return (
        <FloatLabel>
            <Password
                id={"password"}
                value={password}
                onChange={handlePasswordChange}
                footer={footer}
                toggleMask />
            <label htmlFor="password" className="uk-form-label uk-text-bold">Password</label>
        </FloatLabel>
    )
}
