'use client';

import React, { useState } from 'react';
import BaseButton from '@/components/BaseButton';

const ContactUsForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
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
        const { firstName, lastName, email, subject, message, phone } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneNumberRegex = /^\+?[0-9\s\-().]{10,15}$/;

        if (!firstName || !lastName || !email || !subject || !message || !phone) {
            setStatus({
                message: 'Please complete all required fields.',
                isSuccess: false,
            });
            return false;
        }

        if (!emailRegex.test(email)) {
            setStatus({
                message: 'Please enter a valid email address.',
                isSuccess: false,
            });
            return false;
        }

        if (!phoneNumberRegex.test(phone)) {
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

        const data = {
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN,
            email: formData.email,
            phone: formData.phone,
            subject: process.env.NEXT_PUBLIC_SUBJECT,
            customer_subject: formData.subject || process.env.NEXT_PUBLIC_SUBJECT,
            message: formData.message,
            replyto: process.env.NEXT_PUBLIC_REPLY_TO,
            first_name: formData.firstName,
            last_name: formData.lastName,
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
                setStatus({
                    message:
                        'Thank you for your submission!. <br/>Please give us up to 1-3 business days to get back to you.',
                    isSuccess: true,
                });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: '',
                    message: '',
                    phone: '',
                });
            } else {
                setStatus({
                    message:
                        'Oops! Something went wrong. Please try submitting the form again.',
                    isSuccess: false,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({
                message: 'Something went wrong. Please try again.',
                isSuccess: false,
            });
        }
    };

    return (
        <div className='xl:w-[60vw] mx-auto w-[90vw] xl:p-[60px] p-[48px] bg-[#F5F5F5] rounded-[100px]'>
            <form onSubmit={handleSubmit} className='xl:space-y-[32px] space-y-4'>
                <div className='flex space-x-4'>
                    <div className='w-full'>
                        <div className='xl:text-[32px] text-[18px] futura-condensed-medium tracking-wide'>
                            FIRST NAME
                        </div>
                        <input
                            type='text'
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder='Enter you first name'
                            className='futura-medium xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[transparent] w-full rounded-sm border-b-[1px] border-[#A7A7A7] p-2 pl-0'
                        />
                    </div>

                    <div className='w-full'>
                        <div className='xl:text-[32px] text-[18px] futura-condensed-medium tracking-wide'>
                            LAST NAME
                        </div>
                        <input
                            type='text'
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder='Enter you last name'
                            className='futura-medium xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[transparent] w-full rounded-sm border-b-[1px] border-[#A7A7A7] p-2 pl-0'
                        />
                    </div>
                </div>

                <div className='flex space-x-4'>
                    <div className='w-full'>
                        <div className='xl:text-[32px] text-[18px] futura-condensed-medium tracking-wide'>
                            Email
                        </div>

                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            className='futura-medium xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[transparent] w-full rounded-sm border-b-[1px] border-[#A7A7A7] p-2 pl-0'
                        />
                    </div>

                    <div className='w-full'>
                        <div className='xl:text-[32px] text-[18px] futura-condensed-medium tracking-wide'>
                            Phone
                        </div>

                        <input
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder='Enter your phone'
                            className='futura-medium xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[transparent] w-full rounded-sm border-b-[1px] border-[#A7A7A7] p-2 pl-0'
                        />
                    </div>
                </div>

                <div className='w-full'>
                    <div className='xl:text-[32px] text-[18px] futura-condensed-medium tracking-wide'>
                        Subject
                    </div>

                    <input
                        type='text'
                        name='subject'
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder='Enter your subject'
                        className='futura-medium xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[transparent] w-full rounded-sm border-b-[1px] border-[#A7A7A7] p-2 pl-0'
                    />
                </div>

                <div className='w-full'>
                    <div className='xl:text-[32px] text-[18px] futura-condensed-medium tracking-wide'>
                        Message
                    </div>

                    <textarea
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        rows='5'
                        placeholder='Enter your message'
                        className='futura-medium xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[transparent] w-full rounded-sm border-b-[1px] border-[#A7A7A7] p-2 pl-0'
                    />
                </div>

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
