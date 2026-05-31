const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const IR_FALLBACK_EMAIL =
    process.env.NEXT_PUBLIC_IR_CONTACT_EMAIL || 'MOT@gateway-grp.com';

const MAIN_FALLBACK_EMAIL =
    process.env.NEXT_PUBLIC_REPLY_TO || 'sales@metaoptics.com.sg';

/**
 * Submit a form to Web3Forms (works with static export — no backend required).
 * Recipient inbox is configured per access key in the Web3Forms dashboard.
 */
export async function submitWeb3Form(payload, { fallbackEmail = MAIN_FALLBACK_EMAIL } = {}) {
    const accessKey = payload?.access_key;

    if (!accessKey) {
        return {
            ok: false,
            error: `This form is not configured yet. Please contact us at ${fallbackEmail}.`,
        };
    }

    try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            return {
                ok: false,
                error: data.message || 'Something went wrong. Please try again later.',
            };
        }

        return { ok: true };
    } catch {
        return {
            ok: false,
            error: 'Something went wrong. Please try again later.',
        };
    }
}

export const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export const isValidPhone = (value) =>
    /^\+?[0-9\s\-().]{10,15}$/.test(String(value || '').trim());

/** Main site — /contact-us */
export function buildMainContactPayload(formData) {
    return {
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN,
        subject: process.env.NEXT_PUBLIC_SUBJECT || 'MetaOptics - Contact Form',
        from_name: 'MetaOptics Website Contact',
        email: formData.email,
        phone: formData.phone,
        customer_subject: formData.subject,
        message: formData.message,
        replyto: process.env.NEXT_PUBLIC_REPLY_TO || formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: formData.fullName,
        redirect: process.env.NEXT_PUBLIC_REDIRECT_URL || undefined,
    };
}

/** IR — Resources / Contact Us */
export function buildIrContactPayload(form) {
    return {
        access_key: process.env.NEXT_PUBLIC_IR_WEB3FORMS_ACCESS_KEY,
        subject: process.env.NEXT_PUBLIC_IR_CONTACT_SUBJECT || 'MetaOptics IR - Investor Contact',
        from_name: 'MetaOptics IR Contact',
        email: form.email,
        replyto: form.email,
        name: form.fullName,
        phone: form.phone || '—',
        investor_subject: form.subject || 'Investor Inquiry',
        message: form.message,
    };
}

/** IR — Resources / Email Alerts */
export function buildIrEmailAlertsPayload({ firstName, lastName, email, preferenceLabels }) {
    return {
        access_key: process.env.NEXT_PUBLIC_IR_WEB3FORMS_ACCESS_KEY,
        subject:
            process.env.NEXT_PUBLIC_IR_EMAIL_ALERTS_SUBJECT ||
            'MetaOptics IR - Email Alert Subscription',
        from_name: 'MetaOptics IR Email Alerts',
        email,
        replyto: email,
        first_name: firstName || '—',
        last_name: lastName || '—',
        alert_preferences: preferenceLabels,
        message: `New email alert subscription.\n\nPreferences: ${preferenceLabels}`,
    };
}

export const submitIrWeb3Form = (payload) =>
    submitWeb3Form(payload, { fallbackEmail: IR_FALLBACK_EMAIL });
