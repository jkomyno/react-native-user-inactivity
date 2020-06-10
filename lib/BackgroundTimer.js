import BackgroundTimer from 'react-native-background-timer';
/**
 * defaultBackgroundTimer implements the TimeoutHandler interface with the native timer
 * functions available in the 'react-native-background-timer' package.
 * This timer works in foreground as well as background, and should overcome
 * the standard setTimeout/clearTimeout shortcomings.
 */
export const defaultBackgroundTimer = {
    clearTimeout: (_) => {
        BackgroundTimer.stopBackgroundTimer();
    },
    setTimeout: (fn, timeout) => {
        BackgroundTimer.runBackgroundTimer(fn, timeout);
    },
};
export default defaultBackgroundTimer;
