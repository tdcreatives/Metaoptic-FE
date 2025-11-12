const isMobile = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768;
    }
    return false; // Default to false if `window` is not defined
};

export { isMobile };


export const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) {
        return str;
      }
    
      let truncated = '';
      const words = str.split(' ');
    
      for (const word of words) {
        if ((truncated + word).length + 1 > maxLength - 3) { // +1 for space, -3 for "..."
          break;
        }
        truncated += (truncated === '' ? '' : ' ') + word;
      }
    
      // Handle cases where even the first word exceeds maxLength
      if (truncated === '' && words[0].length > maxLength - 3) {
        return words[0].substring(0, maxLength - 3) + '...';
      }
    
      return truncated.trim() + '...';
  };