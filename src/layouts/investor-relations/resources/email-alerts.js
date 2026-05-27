'use client';

import React, { useState } from 'react';
import { IconCheck } from '@tabler/icons-react';
import IRContainer from '@/layouts/investor-relations/container';

const PREFERENCES = [
    { id: 'press-releases', label: 'Press Releases' },
    { id: 'sec-filings', label: 'SEC Filings' },
    { id: 'end-of-day-stock-quotes', label: 'End of Day Stock Quotes' },
];

const inputBaseClasses =
    'futura-medium font-medium text-[14px] md:text-[16px] xl:text-[18px] text-[#231F20] ' +
    'placeholder:text-[#A9A9A9] placeholder:text-[14px] placeholder:md:text-[16px] placeholder:xl:text-[18px] placeholder:font-medium ' +
    'border border-[#D9D9D9] rounded-md p-4 bg-white focus:outline-none focus:border-[#231F20] transition-colors w-full';

const FormField = ({ label, name, value, onChange, type = 'text', placeholder }) => (
    <div className='flex flex-col gap-2 flex-1'>
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

const PreferenceCheckbox = ({ preference, checked, onChange }) => (
    <label className='flex items-center gap-3 cursor-pointer select-none'>
        <span
            className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                checked ? 'bg-[#d34c39] border-[#d34c39]' : 'bg-white border-[#D9D9D9]'
            }`}
        >
            {checked && <IconCheck size={16} className='text-white' strokeWidth={3} />}
        </span>
        <input
            type='checkbox'
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className='sr-only'
        />
        <span className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[18px] text-[#231F20]'>
            {preference.label}
        </span>
    </label>
);

const EmailAlerts = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedPrefs, setSelectedPrefs] = useState(['press-releases']);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState('');

    const togglePref = (id, checked) => {
        setSelectedPrefs((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || selectedPrefs.length === 0) {
            setFeedback('Please enter your email and select at least one preference.');
            return;
        }
        setSubmitting(true);
        setFeedback('');
        try {
            console.log('[email-alerts] subscribe payload:', { firstName, lastName, email, preferences: selectedPrefs });
            await new Promise((r) => setTimeout(r, 400));
            setFeedback('Thank you! Your subscription has been received.');
            setFirstName('');
            setLastName('');
            setEmail('');
            setSelectedPrefs(['press-releases']);
        } catch (err) {
            console.error(err);
            setFeedback('Something went wrong. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Email Alerts
            </h2>

            <p className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#111111] leading-[1.6] mt-6 md:mt-8 max-w-[1100px]'>
                Sign up to receive email alerts for the latest press releases, SEC filings, and end of day stock quotes from MetaOptics Ltd. Stay informed about important company developments delivered directly to your inbox.
            </p>

            <form onSubmit={handleSubmit} className='mt-8 md:mt-10'>
                <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-8 lg:gap-12 xl:gap-16 items-start'>
                    <div className='flex flex-col gap-5 md:gap-6'>
                        <div className='flex flex-col md:flex-row gap-5 md:gap-6'>
                            <FormField
                                label='First Name'
                                name='firstName'
                                value={firstName}
                                onChange={setFirstName}
                                placeholder='Your first name here'
                            />
                            <FormField
                                label='Last Name'
                                name='lastName'
                                value={lastName}
                                onChange={setLastName}
                                placeholder='Your last name here'
                            />
                        </div>
                        <FormField
                            label='Email Address'
                            name='email'
                            type='email'
                            value={email}
                            onChange={setEmail}
                            placeholder='yourname@example.com'
                        />
                    </div>

                    <div className='bg-[#F7F7F7] rounded-md p-6 md:p-8'>
                        <h3 className='futura-medium font-medium text-[16px] md:text-[18px] xl:text-[20px] text-[#d34c39] mb-4 md:mb-6'>
                            Alert Preferences
                        </h3>
                        <div className='flex flex-col gap-4 md:gap-5'>
                            {PREFERENCES.map((pref) => (
                                <PreferenceCheckbox
                                    key={pref.id}
                                    preference={pref}
                                    checked={selectedPrefs.includes(pref.id)}
                                    onChange={(checked) => togglePref(pref.id, checked)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='pb-6 border-b border-[#E0E1E0] mt-8 md:mt-10' />

                <button
                    type='submit'
                    disabled={submitting}
                    className='mt-4 bg-[#d34c39] hover:bg-[#231f20] disabled:opacity-60 disabled:cursor-not-allowed text-white uppercase tracking-wider futura-medium font-medium text-[14px] md:text-[16px] px-12 md:px-14 py-4 rounded-full transition-colors'
                >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>

                {feedback && (
                    <div className='mt-4 futura-medium text-[14px] text-[#231F20]'>{feedback}</div>
                )}

                <p className='futura-medium font-medium text-[13px] md:text-[14px] xl:text-[16px] text-[#A9A9A9] leading-[1.6] mt-4 max-w-[800px]'>
                    By subscribing, you agree to receive email communications from MetaOptics Ltd. You can unsubscribe at any time. Your information will not be shared with third parties.
                </p>
            </form>
        </IRContainer>
    );
};

export default EmailAlerts;
