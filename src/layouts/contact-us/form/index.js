'use client';

import React, { useState } from 'react';
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import TurnstileField from '@/components/TurnstileField';
import { postContact } from '@/lib/contact-api';
import { isValidEmail, isValidPhone } from '@/lib/web3forms';

const ContactUsForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState({
        message: '',
        isSuccess: false,
    });
    const [turnstileToken, setTurnstileToken] = useState('');
    const [formKey, setFormKey] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStatus({ message: '', isSuccess: false });
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const { fullName, email, subject, message, phone } = formData;

        if (!fullName || !email || !subject || !message || !phone) {
            setStatus({
                message: 'Please complete all required fields.',
                isSuccess: false,
            });
            return false;
        }

        if (!isValidEmail(email)) {
            setStatus({
                message: 'Please enter a valid email address.',
                isSuccess: false,
            });
            return false;
        }

        if (!isValidPhone(phone)) {
            setStatus({
                message: 'Please enter a valid phone number.',
                isSuccess: false,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!turnstileToken) {
            setStatus({
                message: 'Please complete the captcha.',
                isSuccess: false,
            });
            return;
        }

        const result = await postContact({
            channel: 'main',
            turnstileToken,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
        });

        if (result.ok) {
            setStatus({
                message:
                    'Thank you for your submission!. <br/>Please give us up to 1-3 business days to get back to you.',
                isSuccess: true,
            });
            setFormData({
                fullName: '',
                email: '',
                subject: '',
                message: '',
                phone: '',
            });
            setTurnstileToken('');
            setFormKey((k) => k + 1);
        } else {
            setStatus({
                message: result.error || 'Oops! Something went wrong. Please try submitting the form again.',
                isSuccess: false,
            });
        }
    };

    return (
        <div className='xl:w-[60%] w-[90%] mx-auto max-w-[1150px] xl:pb-8 pb-4'>
            <div className='futura-condensed-medium xl:text-[48px] text-[32px] uppercase text-center text-[#121212]'>
                {' '}
                Write a message
            </div>
            <form
                onSubmit={handleSubmit}
                className='xl:space-y-[32px] space-y-4 xl:mt-[32px] mt-[16px]'>
                <div className='flex xl:space-x-4 space-x-0 xl:flex-row flex-col xl:space-y-0 space-y-4'>
                    <div className='w-full'>
                        <BaseInput
                            type='text'
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder='Full name'
                        />
                    </div>

                    {/* <div className='w-full'>
                        <BaseInput
                            type='text'
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder='Last name'
                        />
                    </div> */}

                    <div className='w-full'>
                        <BaseInput
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Email address'
                        />
                    </div>
                </div>

                <div className='flex xl:space-x-4 space-x-0 xl:flex-row flex-col xl:space-y-0 space-y-4'>
                    <div className='w-full'>
                        <BaseInput
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder='Phone'
                        />
                    </div>

                    <div className='w-full'>
                        <BaseInput
                            type='text'
                            name='subject'
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder='Subject'
                        />
                    </div>
                </div>

                <div className='w-full'>
                    <BaseInput
                        placeholder='Enter your message'
                        name='message'
                        isTextarea
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                        }
                    />
                </div>

                <TurnstileField
                    key={formKey}
                    onToken={setTurnstileToken}
                    onExpire={() => setTurnstileToken('')}
                />

                <BaseButton label='SUBMIT' type='submit' />

                {status.message && (
                    <p
                        className={`text-center mt-4 ${
                            status.isSuccess ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <span dangerouslySetInnerHTML={{ __html: status.message }} />
                    </p>
                )}
            </form>
        </div>
    );
};

export default ContactUsForm;
