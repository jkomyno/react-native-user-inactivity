import React, {
  memo,
  useEffect,
  useRef,
  useState,
  FC,
} from 'react';
import {
  Keyboard,
  PanResponder,
  StyleProp,
  View,
  ViewStyle,
  ViewProps,
} from 'react-native';
import {
  defaultTimeoutHandler,
  TimeoutHandler,
  useTimeout,
} from 'usetimeout-react-hook';

const defaultTimeForInactivity = 10000;
const defaultStyle: ViewStyle = {
  flex: 1,
};

export interface UserInactivityProps<T = unknown> extends ViewProps {
  /**
   * Number of milliseconds after which the view is considered inactive.
   * If it changed, the timer restarts and the view is considered active until
   * the new timer expires.
   * It defaults to 1000.
   */
  timeForInactivity?: number;

  /**
   * If it's explicitly set to `true` after the component has already been initialized,
   * the timer restarts and the view is considered active until the new timer expires.
   * It defaults to true.
   */
  isActive?: boolean;

  /**
   * Prevents the PanResponder instance from being created so that user
   * gestures are ignored and do not reset the timer.
   * It defaults to false;
   */
  ignoreGestures?: boolean;

  /**
   * Generic usetimeout-react-hook's TimeoutHandler implementation.
   * It defaults to the standard setTimeout/clearTimeout implementation.
   * See https://github.com/jkomyno/usetimeout-react-hook/#-how-to-use.
   */
  timeoutHandler?: TimeoutHandler<T>;

  /**
   * Children components to embed inside UserInactivity's View.
   * If any children component is pressed, `onAction` is called after
   * `timeForInactivity` milliseconds.
   */
  children: React.ReactNode;

  /**
   * If set to true, the timer is not reset when the keyboard appears
   * or disappears.
   */
  skipKeyboard?: boolean;

  /**
   * Optional custom style for UserInactivity's View.
   * It defaults to { flex: 1 }.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Callback triggered anytime UserInactivity's View isn't touched for more than
   * `timeForInactivity` seconds.
   * It's `active` argument is true if and only if the View wasn't touched for more
   * than `timeForInactivity` milliseconds.
   */
  onAction: (active: boolean) => void;
}

const UserInactivity: FC<UserInactivityProps> = ({
  children,
  isActive,
  ignoreGestures = false,
  onAction,
  skipKeyboard,
  style,
  timeForInactivity,
  timeoutHandler,
  ...rest
}) => {
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
    } else {
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
  function resetTimerForPanResponder(/* event: GestureResponderEvent */) {
    // const { identifier: touchID } = event.nativeEvent;
    resetTimerDueToActivity();
    return false;
  }

  /**
   * The PanResponder instance.
   */
  const [panResponder, setPanResponder] = useState(
    ignoreGestures ? { panHandlers: {} } : PanResponder.create({
      onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
      onPanResponderTerminationRequest: resetTimerForPanResponder,
      onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
    }),
  );
  useEffect(() => {
    if (!isFirstRender.current) {
      setPanResponder(ignoreGestures ? { panHandlers: {} } : PanResponder.create({
        onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
        onPanResponderTerminationRequest: resetTimerForPanResponder,
        onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
      }));
    } 
  }, [ignoreGestures]);

  return (
    <View
      style={actualStyle}
      collapsable={false}
      {...rest}
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
};

export default memo(UserInactivity);
