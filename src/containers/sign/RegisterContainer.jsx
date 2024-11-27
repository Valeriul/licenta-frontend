import React, { useState, useRef } from 'react';
import ReactCardFlip from 'react-card-flip';
import 'uikit/dist/css/uikit.min.css';
import lofiImage from '../../assets/img/lofi.png';
import '../../styles.css';
import CPassword from '../../components/Password/Password';
import CountrySelect from '../../components/CountryDropdown/CountryDropdown';
import CPhoneInput from '../../components/PhoneInput/CPhoneInput';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import InfoSentEmailContainer from './InfoSentEmailContainer';

function RegisterContainer({ onLoginClick }) {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        country: '',
        city: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });

    const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(true);
    const [timer, setTimer] = useState(30);
    const toast = useRef(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleValueChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all fields.',
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match.' });
            return;
        }

        const userData = { ...formData };

        delete userData.confirmPassword;

        fetch(process.env.REACT_APP_API_URL +'/User/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            })
            .then(data => {
                setIsFlipped(!isFlipped);
                fetch(process.env.REACT_APP_API_URL +'/Mail/sendVerificationEmail', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData.email)
                });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            });
    };

    return <>
        <Toast ref={toast} appendTo={document.getElementById('root')} />
        <div className="uk-flex uk-position-center uk-height-1-1 uk-flex-center uk-flex-middle"
            style={{ width: "100vw" }}>
            <div className="uk-card uk-card-default shadow-box uk-cover-container"
                style={{ backgroundColor: "#F2E9E1", width: "60%" }}>
                <div className="uk-flex">
                    <div className="uk-width-1-2 uk-height-max"
                        style={{
                            backgroundImage: `url(${lofiImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}>

                    </div>

                    <div className="uk-width-1-2 form-section uk-padding-small">
                        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                            <div key="front" className="flip-card">
                                <h1 className="uk-text-left uk-text-bold">Register</h1>
                                <div>
                                    <div className="uk-inline uk-width-1-2 uk-padding-small">
                                        <FloatLabel>
                                            <InputText id="firstName" value={formData.firstName} onChange={handleValueChange} className='uk-width-1-1' />
                                            <label htmlFor="firstName" className="uk-form-label uk-text-bold">First Name</label>
                                        </FloatLabel>
                                    </div>
                                    <div className="uk-inline uk-width-1-2 uk-padding-small">
                                        <FloatLabel>
                                            <InputText id="lastName" value={formData.lastName} onChange={handleValueChange} className='uk-width-1-1' />
                                            <label htmlFor="lastname" className="uk-form-label uk-text-bold">Last name</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                                <div className='uk-flex uk-flex-center'>
                                    <div className="uk-inline uk-width-2-3 uk-padding-small">
                                        <CPhoneInput value={formData.phoneNumber} onChange={(phone) => setFormData({ ...formData, phoneNumber: "+" + phone })} />
                                    </div>
                                </div>
                                <div className='uk-flex uk-flex-center'>
                                    <div className="uk-inline uk-width-2-3 uk-padding-small">
                                        <FloatLabel>
                                            <InputText id="email" value={formData.email} onChange={handleValueChange} className='uk-width-1-1' />
                                            <label htmlFor="email" className="uk-form-label uk-text-bold">Email</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                                <div>
                                    <div className="uk-inline uk-width-1-2 uk-padding-small">
                                        <CountrySelect value={formData.country.name} onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value.name })} />
                                    </div>
                                    <div className="uk-inline uk-width-1-2 uk-padding-small">
                                        <FloatLabel>
                                            <InputText id="city" value={formData.city} onChange={handleValueChange} className='uk-width-1-1' />
                                            <label htmlFor="city" className="uk-form-label uk-text-bold">City</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                                <div>
                                    <div className="uk-inline uk-width-1-2 uk-padding-small">
                                        <CPassword value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </div>
                                    <div className="uk-inline uk-width-1-2 uk-padding-small">
                                        <FloatLabel>
                                            <Password id="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className='uk-width-1-1' feedback={false} />
                                            <label htmlFor="confirmPassword" className="uk-form-label uk-text-bold">Confirm password</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                                <div className="uk-padding-small">
                                    <label className="uk-form-label uk-text-bold">Gender</label>
                                    <div className="uk-flex uk-flex-around">
                                        {['male', 'female', 'other', 'prefer-not-to-say'].map((gender) => (
                                            <label key={gender}>
                                                <input className="uk-radio" type="radio" name="gender" value={gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} /> {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="uk-padding-small">
                                    <button className="button-submit  uk-width-1-1" onClick={handleRegister}>Register</button>
                                </div>
                                <div className="uk-padding-small">
                                    <p className="uk-text-center">Already have an account? <a href="#"
                                        onClick={onLoginClick}
                                        style={{ color: "var(--muted-olive)" }}>Login</a>
                                    </p>
                                </div>
                            </div>

                            <div key="back" className="flip-card" style={{ marginTop: "225px", marginBottom: "225px" }}>
                                <InfoSentEmailContainer email={formData.email} />
                            </div>
                        </ReactCardFlip>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default RegisterContainer;