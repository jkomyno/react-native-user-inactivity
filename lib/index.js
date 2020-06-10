import * as tslib_1 from "tslib";
import React, { memo, useEffect, useRef, useState, } from 'react';
import { Keyboard, PanResponder, View, } from 'react-native';
import { defaultTimeoutHandler, useTimeout, } from 'usetimeout-react-hook';
const defaultTimeForInactivity = 10000;
const defaultStyle = {
    flex: 1,
};
const UserInactivity = (_a) => {
    var { children, isActive, ignoreGestures = false, onAction, skipKeyboard, style, timeForInactivity, timeoutHandler } = _a, rest = tslib_1.__rest(_a, ["children", "isActive", "ignoreGestures", "onAction", "skipKeyboard", "style", "timeForInactivity", "timeoutHandler"]);
    const actualStyle = style || defaultStyle;
    /**
     * If the user has provided a custom timeout handler, it is used directly,
     * otherwise it defaults to the default timeout handler (setTimeout/clearTimeout).
     */
    const actualTimeoutHandler = timeoutHandler || defaultTimeoutHandler;
    const timeout = timeForInactivity || defaultTimeForInactivity;
    /**
     * If the `isActive` prop is manually changed to `true`, call `resetTimerDueToActivity`
     * to reset the timer and set the current state to active until the timeout expires.
     * If the `isActive` is changed to `false`, nothing is done.
     * Note however that toggling `isActive` manually is discouraged for normal use.
     * It should only be used in those cases where React Native doesnt't seem to
     * inform the `PanResponder` instance about touch events, such as when tapping
     * over the keyboard.
     */
    const initialActive = isActive === undefined ? true : isActive;
    const [active, setActive] = useState(initialActive);
    useEffect(() => {
        if (isActive) {
            resetTimerDueToActivity();
        }
    }, [isActive]);
    const [date, setDate] = useState(Date.now());
    /**
     * The timeout is reset when either `date` or `timeout` change.
     */
    const cancelTimer = useTimeout(() => {
        setActive(false);
        onAction(false);
        // @ts-ignore
    }, timeout, actualTimeoutHandler, [date, timeout]);
    const isFirstRender = useRef(true);
    /**
     * Triggers `onAction` each time the `active` state turns true
     * after the initial render.
     */
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else {
            if (active) {
                onAction(true);
            }
        }
    }, [active]);
    /**
     * Resets the timer every time the keyboard appears or disappears,
     * unless skipKeyboard is true.
     */
    useEffect(() => {
        if (!skipKeyboard) {
            Keyboard.addListener('keyboardDidHide', resetTimerDueToActivity);
            Keyboard.addListener('keyboardDidShow', resetTimerDueToActivity);
        }
        // release event listeners on destruction
        return () => {
            if (!skipKeyboard) {
                Keyboard.removeAllListeners('keyboardDidHide');
                Keyboard.removeAllListeners('keyboardDidShow');
            }
        };
    }, []);
    /**
     * This method is called whenever a touch is detected. If no touch is
     * detected after `this.props.timeForInactivity` milliseconds, then
     * `this.state.inactive` turns to true.
     */
    function resetTimerDueToActivity() {
        cancelTimer();
        setActive(true);
        /**
         * Causes `useTimeout` to restart.
         */
        setDate(Date.now());
    }
    /**
     * In order not to steal any touches from the children components, this method
     * must return false.
     */
    function resetTimerForPanResponder( /* event: GestureResponderEvent */) {
        // const { identifier: touchID } = event.nativeEvent;
        resetTimerDueToActivity();
        return false;
    }
    /**
     * The PanResponder instance.
     */
    const [panResponder, setPanResponder] = useState(ignoreGestures ? { panHandlers: {} } : PanResponder.create({
        onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
        onPanResponderTerminationRequest: resetTimerForPanResponder,
        onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
    }));
    useEffect(() => {
        if (!isFirstRender.current) {
            setPanResponder(ignoreGestures ? { panHandlers: {} } : PanResponder.create({
                onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
                onPanResponderTerminationRequest: resetTimerForPanResponder,
                onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
            }));
        }
    }, [ignoreGestures]);
    return (<View style={actualStyle} collapsable={false} {...rest} {...panResponder.panHandlers}>
      {children}
    </View>);
};
export default memo(UserInactivity);
