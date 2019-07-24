import * as React from 'react';
import {
  PanResponder,
  PanResponderInstance,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

export interface UserInactivityProps {
  timeForInactivity?: number;
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
  onAction: (active: boolean) => void;
}

interface State {
  active: boolean;
}

export default class UserInactivity extends React.PureComponent<UserInactivityProps, State> {
  static defaultProps = {
    style: {
      flex: 1,
    },
    timeForInactivity: 10000,
  };

  state = {
    active: true,
  };

  private panResponder!: PanResponderInstance;
  private timeout: number | undefined;

  private clearTimer = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
      onPanResponderTerminationRequest: this.onShouldSetPanResponderCapture,
      onStartShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
    });
    this.handleInactivity();
  }

  componentDidUpdate(prevProps: UserInactivityProps) {
    if (prevProps.timeForInactivity !== this.props.timeForInactivity) {
        this.clearTimer();
        this.resetTimeout();
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  /**
   * This method is called whenever a touch is detected. If no touch is
   * detected after `this.props.timeForInactivity` milliseconds, then
   * `this.state.inactive` turns to true.
   */
  handleInactivity = () => {
    this.clearTimer();
    this.setState({
      active: true,
    }, () => {
      this.props.onAction(this.state.active); // true
    });
    this.resetTimeout();
  }

  /**
   * If more than `this.props.timeForInactivity` milliseconds have passed
   * from the latest touch event, then the current state is set to `inactive`
   * and the `this.props.onInactivity` callback is dispatched.
   */
  timeoutHandler = () => {
    this.setState({
      active: false,
    }, () => {
      this.props.onAction(this.state.active); // false
    });
  }

  resetTimeout = () => {
    this.timeout = setTimeout(this.timeoutHandler, this.props.timeForInactivity);
  }

  onShouldSetPanResponderCapture = () => {
    this.handleInactivity();
    /**
     * In order not to steal any touches from the children components, this method
     * must return false.
     */
    return false;
  }

  render() {
    const {
      style,
      children,
    } = this.props;
    return (
      <View
        style={style}
        collapsable={false}
        {...this.panResponder.panHandlers}
      >
        {children}
      </View>
    );
  }
}
