'use client';

import React, { useState } from 'react';
import IRContainer from '@/layouts/investor-relations/container';

const inputBaseClasses =
    'futura-medium font-medium text-[14px] md:text-[16px] xl:text-[18px] text-[#231F20] ' +
    'placeholder:text-[#A9A9A9] placeholder:text-[14px] placeholder:md:text-[16px] placeholder:xl:text-[18px] placeholder:font-medium ' +
    'border border-[#D9D9D9] rounded-md p-4 bg-white focus:outline-none focus:border-[#231F20] transition-colors w-full';

const FormField = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div className='flex flex-col gap-2'>
        <label htmlFor={name} className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#231F20]'>
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputBaseClasses} h-[56px]`}
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
    <div className='flex flex-col gap-2'>
        <label htmlFor={name} className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#231F20]'>
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputBaseClasses} resize-y leading-[1.5]`}
        />
    </div>
);

const SendMessage = () => {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState('');

    const update = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.message) {
            setFeedback('Please fill in Full Name, Email Address, and Message.');
            return;
        }
        setSubmitting(true);
        setFeedback('');
        try {
            console.log('[contact-us] submit payload:', form);
            await new Promise((r) => setTimeout(r, 400));
            setFeedback('Thank you! Your message has been received.');
            setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            console.error(err);
            setFeedback('Something went wrong. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='mt-6 md:mt-8 lg:mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6'>
                <FormField
                    label='Full Name'
                    name='fullName'
                    value={form.fullName}
                    onChange={update('fullName')}
                    placeholder='e.g. John Smith'
                />
                <FormField
                    label='Email Address'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={update('email')}
                    placeholder='e.g. john@example.com'
                />
                <FormField
                    label='Phone (Optional)'
                    name='phone'
                    type='tel'
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder='e.g. +1 415 000 0000'
                />
                <FormField
                    label='Subject'
                    name='subject'
                    value={form.subject}
                    onChange={update('subject')}
                    placeholder='Investor Inquiry'
                />
            </div>

            <div className='mt-5 md:mt-6'>
                <TextAreaField
                    label='Message'
                    name='message'
                    value={form.message}
                    onChange={update('message')}
                    placeholder='How can we help you?'
                    rows={4}
                />
            </div>

            <div className='border-b border-[#E0E1E0] my-8 md:my-10' />

            <button
                type='submit'
                disabled={submitting}
                className='bg-[#d34c39] hover:bg-[#231f20] disabled:opacity-60 disabled:cursor-not-allowed text-white uppercase tracking-wider futura-medium font-medium text-[14px] md:text-[16px] px-12 md:px-14 py-4 rounded-full transition-colors'
            >
                {submitting ? 'Submitting...' : 'Submit'}
            </button>

            {feedback && (
                <div className='mt-4 futura-medium text-[14px] text-[#231F20]'>{feedback}</div>
            )}
        </form>
    );
};

const ContactUs = () => {
    return (
        <>
            <IRContainer className='py-12 md:py-16 lg:py-20'>
                <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                    Send Us a Message
                </h2>
                <SendMessage />
            </IRContainer>

            <IRContainer className='py-12 md:py-16 lg:py-20'>
                <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                    Investor Relations
                </h2>

                <div className='mt-8 md:mt-10'>
                    <h3 className='futura-condensed-medium font-medium text-[22px] md:text-[24px] xl:text-[28px] text-[#d34c39]'>
                        Gateway Group, Inc.
                    </h3>

                    <div className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#111111] leading-[2] mt-4'>
                        <div>
                            Email:{' '}
                            <a
                                href='mailto:MOT@gateway-grp.com'
                                className='text-[#111111] underline underline-offset-4 hover:text-[#d34c39] transition-colors'
                            >
                                MOT@gateway-grp.com
                            </a>
                        </div>
                        <div>
                            Phone:{' '}
                            <a
                                href='tel:+19495743860'
                                className='text-[#111111] hover:text-[#d34c39] transition-colors'
                            >
                                949-574-3860
                            </a>
                        </div>
                    </div>
                </div>
            </IRContainer>
        </>
    );
};

export default ContactUs;
