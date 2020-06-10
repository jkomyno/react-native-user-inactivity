import { TimeoutHandler } from 'usetimeout-react-hook';
/**
 * defaultBackgroundTimer implements the TimeoutHandler interface with the native timer
 * functions available in the 'react-native-background-timer' package.
 * This timer works in foreground as well as background, and should overcome
 * the standard setTimeout/clearTimeout shortcomings.
 */
export declare const defaultBackgroundTimer: TimeoutHandler<void>;
export default defaultBackgroundTimer;
