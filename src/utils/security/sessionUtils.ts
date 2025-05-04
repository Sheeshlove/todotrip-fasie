
/**
 * Sets up session timeout and automatic logout
 * 
 * @param timeoutMinutes Number of minutes before session times out
 * @param onTimeout Callback to execute when session times out
 * @returns Cleanup function
 */
export const setupSessionTimeout = (timeoutMinutes: number, onTimeout: () => void): (() => void) => {
  let timeoutId: number | null = null;
  
  // Reset timeout on user activity
  const resetTimeout = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      onTimeout();
    }, timeoutMinutes * 60 * 1000);
  };
  
  // Set up event listeners for user activity
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  activityEvents.forEach(event => {
    document.addEventListener(event, resetTimeout);
  });
  
  // Initialize timeout
  resetTimeout();
  
  // Return cleanup function
  return () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    
    activityEvents.forEach(event => {
      document.removeEventListener(event, resetTimeout);
    });
  };
};
