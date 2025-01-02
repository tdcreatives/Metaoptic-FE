const isMobile = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768;
    }
    return false; // Default to false if `window` is not defined
};

export { isMobile };
