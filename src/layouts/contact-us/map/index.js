const ContactUsMap = () => {
    return (
        <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.793363208235!2d103.78323691198368!3d1.2987429986834653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1a5009faf2d7%3A0x1a11fe10225cec6b!2s81%20Ayer%20Rajah%20Crescent%2C%20%2301%2045%2C%20Singapore%20139967!5e0!3m2!1sen!2ssg!4v1730424885805!5m2!1sen!2ssg'
            width='100%'
            style={{
                border: 0,
            }}
            allowFullScreen={false}
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            className='h-[450px] xl:h-[600px]'></iframe>
    );
};

export default ContactUsMap;
