import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import './CPhoneInput.css';

const PhoneInputComponent = ({ value, onChange }) => {
    return (
        <div className="phone-input-container">
            <PhoneInput
                id={"phoneNumber"}
                country={'ro'} 
                value={value}
                onChange={onChange}
                inputClass={"custom-phone-input"}
                containerClass={"custom-phone-container"}
                buttonClass={"custom-phone-button"}
                dropdownClass={"custom-phone-dropdown"}
                searchClass={"custom-phone-search"}
                preferredCountries={['ro', 'us', 'de', 'fr', 'uk']}
                disableCountryCode={false}
                autoFormat={true}
                placeholder="Enter your phone number"
            />
        </div>
    );
};

export default PhoneInputComponent;
