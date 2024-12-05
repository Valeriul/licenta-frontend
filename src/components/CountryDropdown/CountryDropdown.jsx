import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './CountryDropdown.css';
import { FloatLabel } from 'primereact/floatlabel';

const CountryDropdown = ({value,onChange}) => {
    const [selectedCountry, setSelectedCountry] = useState(value);

    
    const countries = [
        { name: 'United States', code: 'US' },
        { name: 'Canada', code: 'CA' },
        { name: 'United Kingdom', code: 'UK' },
        { name: 'Australia', code: 'AU' },
        { name: 'Germany', code: 'DE' },
        { name: 'France', code: 'FR' },
        { name: 'India', code: 'IN' },
        { name: 'China', code: 'CN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Brazil', code: 'BR' }
    ];

    
    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <img
                        alt={option.name}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        style={{ width: '20px', height: '14px' }}
                    />
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    
    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img
                    alt={option.name}
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    style={{ width: '20px', height: '14px' }}
                />
                <div>{option.name}</div>
            </div>
        );
    };

    
    const handleCountryChange = (e) => {
        setSelectedCountry(e.value);
        onChange(e);
    }

    return (
        <FloatLabel>
            <Dropdown
                id="country"
                value={selectedCountry}
                options={countries}
                onChange={handleCountryChange}
                optionLabel="name"
                filter
                placeholder='&nbsp;'
                filterBy="name"
                valueTemplate={selectedCountryTemplate}
                itemTemplate={countryOptionTemplate}
                showClear
            />
            <label htmlFor="country" className="uk-form-label uk-text-bold">Select a country</label>
        </FloatLabel>
    );
};

export default CountryDropdown;
