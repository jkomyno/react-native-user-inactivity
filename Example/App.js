import React, { PureComponent } from 'react';
import {
  Text,
  Button,
  StyleSheet
} from 'react-native';
import UserInactivity from 'react-native-user-inactivity';

const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});

export default class App extends PureComponent {
  state = {
    timeWentInactive: null,
  };

  onInactivity = (timeWentInactive) => {
    this.setState({
      timeWentInactive,
    });
  }

  render() {
    const { timeWentInactive } = this.state;
    return (
      <UserInactivity
        timeForInactivity={5000}
        checkInterval={1000}
        onInactivity={this.onInactivity}
      >
        <Text style={styles.paragraph}>
          Put your app here
          {timeWentInactive &&
            ` (inactive at: ${timeWentInactive})`}
        </Text>

        <Button
          title="Here is a button for some reason"
          onPress={() => alert('hi')}
        />
      </UserInactivity>
    );
  }
}