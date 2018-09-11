import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  PanResponder,
  ViewPropTypes,
} from 'react-native';

class UserInactivity extends PureComponent {
  static propTypes = {
    timeForInactivity: PropTypes.number,
    children: PropTypes.node.isRequired,
    style: ViewPropTypes.style,
    onAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeForInactivity: 10000,
    style: {
      flex: 1,
    },
  };

  state = {
    active: true,
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({ 
      onMoveShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
      onStartShouldSetPanResponderCapture: this.onShouldSetPanResponderCapture,
      onResponderTerminationRequest: this.handleInactivity
    });
    this.handleInactivity();
  }

  componentWillUnmount() {
    clearInterval(this.inactivityTimer);
  }

  /**
   * This method is called whenever a touch is detected. If no touch is
   * detected after `this.props.timeForInactivity` milliseconds, then
   * `this.state.inactive` turns to true.
   */
  handleInactivity = () => {
    clearTimeout(this.timeout);
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