import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

declare module 'react-native-user-inactivity' {
    declare class UserInactivity extends React.Component<UserInactivityProps> {}
    export interface UserInactivityProps {
        /**
         * Inactivity time threshold.
         *
         * Default: 10000
         */
        timeForInactivity?: number;
        /**
         * How often should we check inactivity
         *
         * Default: 2000
         */
        checkInterval?: number;
        /**
         * Callback for when the user becomes inactive
         */
        onInactivity: (...args: any[]) => any;
        /**
         * The style of the wrapper
         *
         * Default: `{ flex: 1 }`
         */
        style?: StyleProp<ViewStyle>;
    }
    export default UserInactivity;
}
