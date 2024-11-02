'use client';

import React, { useState } from 'react';

const ContactUsForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState({
        message: '',
        isSuccess: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStatus({ message: '', isSuccess: false });
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const { firstName, lastName, email, subject, message } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstName || !lastName || !email || !subject || !message) {
            setStatus({ message: 'All fields are required.', isSuccess: false });
            return false;
        }

        if (!emailRegex.test(email)) {
            setStatus({ message: 'Invalid email format.', isSuccess: false });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const data = {
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN,
            email: formData.email,
            subject: formData.subject || process.env.NEXT_PUBLIC_SUBJECT,
            message: formData.message,
            replyto: process.env.NEXT_PUBLIC_REPLY_TO,
            firstname: formData.firstName,
            lastname: formData.lastName,
            redirect: process.env.NEXT_PUBLIC_REDIRECT_URL,
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus({ message: 'Form submitted successfully!', isSuccess: true });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: '',
                    message: '',
                });
            } else {
                setStatus({
                    message: 'Failed to submit the form. Please try again.',
                    isSuccess: false,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({
                message: 'An error occurred. Please try again.',
                isSuccess: false,
            });
        }
    };

    return (
        <div className='xl:w-[40vw] mx-auto w-[90vw] xl:pb-[118px] pb-[48px]'>
            <form onSubmit={handleSubmit} className='xl:space-y-[32px] space-y-4'>
                <div className='flex space-x-4'>
                    <input
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder='First Name'
                        className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                    />
                    <input
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder='Last Name'
                        className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                    />
                </div>
                <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email'
                    className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                />
                <input
                    type='text'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder='Subject'
                    className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                />
                <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    placeholder='Message'
                    className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 h-32 rounded-sm'></textarea>
                <div className='flex justify-center'>
                    <button
                        type='submit'
                        className='futura-book bg-[#D95442] text-white xl:text-[24px] text-[18px] py-2 xl:px-8 px-6 rounded-sm'>
                        SUBMIT
                    </button>
                </div>
                {status.message && (
                    <p
                        className={`text-center mt-4 ${
                            status.isSuccess ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {status.message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default ContactUsForm;
