'use client';

import React, { useCallback, useEffect, useId, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import IRContainer from '@/layouts/investor-relations/container';
import { ANNOUNCEMENT_CATEGORIES } from '@/utils/announcements';
import { isValidEmail } from '@/lib/web3forms';
import { postSubscribe, postUnsubscribe, stripUnsubSearch } from '@/lib/subscribe-api';
import TurnstileField from '@/components/TurnstileField';

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
            {preference}
        </span>
    </label>
);

/** Click-outside / Esc dismissible notice (success + errors). */
const FeedbackToast = ({ notice, onClose }) => {
    const titleId = useId();
    const isSuccess = notice?.tone === 'success';

    useEffect(() => {
        if (!notice) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [notice, onClose]);

    if (!notice) return null;

    return (
        <div
            className='fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4'
            onClick={onClose}
            role='presentation'
        >
            <div
                role='alertdialog'
                aria-modal='true'
                aria-labelledby={titleId}
                className='relative w-full max-w-[420px] bg-white rounded-md shadow-lg border border-[#E0E1E0] p-6 md:p-8'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute right-3 top-3 text-[#71717a] hover:text-[#231F20] p-1'
                    aria-label='Close notification'
                >
                    <IconX size={22} stroke={2.25} />
                </button>
                <div
                    className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                        isSuccess ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#fef2f2] text-[#b91c1c]'
                    }`}
                    aria-hidden='true'
                >
                    {isSuccess ? <IconCheck size={26} strokeWidth={2.5} /> : <IconX size={26} strokeWidth={2.5} />}
                </div>
                <h3
                    id={titleId}
                    className='futura-medium font-medium text-center text-[18px] md:text-[20px] text-[#231F20]'
                >
                    {notice.title}
                </h3>
                <p className='futura-medium mt-3 text-center text-[14px] md:text-[16px] text-[#52525b] leading-[1.55]'>
                    {notice.message}
                </p>
                <button
                    type='button'
                    onClick={onClose}
                    className='mt-6 w-full bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium font-medium text-[14px] py-3 rounded-full transition-colors'
                >
                    OK
                </button>
                <p className='mt-3 text-center text-[12px] text-[#A9A9A9] futura-medium'>
                    Click outside to dismiss
                </p>
            </div>
        </div>
    );
};

const EmailAlertsForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [formKey, setFormKey] = useState(0);
    const [selected, setSelected] = useState([ANNOUNCEMENT_CATEGORIES[0]]);
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState(null);

    const showNotice = (tone, title, message) => setNotice({ tone, title, message });
    const closeNotice = useCallback(() => setNotice(null), []);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('unsub');
        if (!token) return;
        postUnsubscribe(token)
            .then(() => {
                showNotice('success', 'Unsubscribed', 'You have been unsubscribed from MetaOptics email alerts.');
                window.history.replaceState({}, '', stripUnsubSearch(window.location.href));
            })
            .catch(() => showNotice('error', 'Unsubscribe failed', 'Unable to unsubscribe. Please try again later.'));
    }, []);

    const togglePref = (id, checked) => {
        setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || selected.length === 0) {
            showNotice('error', 'Almost there', 'Please enter your email and select at least one alert preference.');
            return;
        }
        if (!isValidEmail(email)) {
            showNotice('error', 'Invalid email', 'Please enter a valid email address.');
            return;
        }
        if (!turnstileToken) {
            showNotice('error', 'Captcha required', 'Please complete the captcha before subscribing.');
            return;
        }

        setSubmitting(true);

        try {
            await postSubscribe({
                email,
                first_name: firstName,
                last_name: lastName,
                categories: selected,
                website,
                turnstileToken,
            });
            showNotice(
                'success',
                'Subscription received',
                'Thank you for signing up. Please check your inbox and confirm your email to activate alerts.',
            );
            setFirstName('');
            setLastName('');
            setEmail('');
            setWebsite('');
            setSelected([ANNOUNCEMENT_CATEGORIES[0]]);
        } catch {
            showNotice('error', 'Something went wrong', 'We could not complete your subscription. Please try again later.');
        }
        setTurnstileToken('');
        setFormKey((k) => k + 1);

        setSubmitting(false);
    };

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Email Alerts
            </h2>

            <p className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#111111] leading-[1.6] mt-6 md:mt-8 max-w-[1100px]'>
                Sign up to receive email alerts for MetaOptics Ltd company announcements. Stay informed about important developments delivered directly to your inbox.
            </p>

            <form onSubmit={handleSubmit} className='relative mt-8 md:mt-10'>
                <div
                    aria-hidden='true'
                    className='absolute -left-[9999px] h-0 w-0 overflow-hidden'
                >
                    <label htmlFor='website'>Website</label>
                    <input
                        id='website'
                        name='website'
                        type='text'
                        tabIndex={-1}
                        autoComplete='off'
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>

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
                            {ANNOUNCEMENT_CATEGORIES.map((pref) => (
                                <PreferenceCheckbox
                                    key={pref}
                                    preference={pref}
                                    checked={selected.includes(pref)}
                                    onChange={(checked) => togglePref(pref, checked)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='pb-6 border-b border-[#E0E1E0] mt-8 md:mt-10' />

                <TurnstileField
                    key={formKey}
                    onToken={setTurnstileToken}
                    onExpire={() => setTurnstileToken('')}
                    className='mt-6'
                />

                <button
                    type='submit'
                    disabled={submitting}
                    className='mt-4 bg-[#d34c39] hover:bg-[#231f20] disabled:opacity-60 disabled:cursor-not-allowed text-white uppercase tracking-wider futura-medium font-medium text-[14px] md:text-[16px] px-12 md:px-14 py-4 rounded-full transition-colors'
                >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>

                <p className='futura-medium font-medium text-[13px] md:text-[14px] xl:text-[16px] text-[#A9A9A9] leading-[1.6] mt-4 max-w-[800px]'>
                    By subscribing, you agree to receive email communications from MetaOptics Ltd. You can unsubscribe at any time. Your information will not be shared with third parties.
                </p>
            </form>

            <FeedbackToast notice={notice} onClose={closeNotice} />
        </IRContainer>
    );
};

export default EmailAlertsForm;
