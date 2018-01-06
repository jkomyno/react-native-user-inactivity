# react-native-user-inactivity
Simple component that alerts when the user is inactive (i.e. when the App surface hasn't been touched for X ms).

## Installation
- with npm:
```sh
npm install --save react-native-user-inactivity
```

- with yarn
```sh
yarn add react-native-user-inactivity
```

## How to import
```js
import UserInactivity from 'react-native-user-inactivity';
```

## Basic Example
```js
import React, { Component } from 'react';
import { Text } from 'react-native';
import UserInactivity from 'react-native-user-inactivity';

export default class App extends Component {

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
      </UserInactivity>
    );
  }
}
```

Also, please checkout the Example directory and run the application (`react-native run-android` or `react-native run-ios`).

## Props
The time is expressed in milliseconds (*ms*).

| Prop                  | Type     | Explanation                                 | Required | Default Value |
| --------------------- |--------- | ------------------------------------------- | -------- | ------------- |
| **timeForInactivity** | number   | Inactivity time threshold                   | no       | 10000         |
| **checkInterval**     | number   | How often should we check inactivity        | no       | 2000          |
| **onInactivity**      | function | Callback for when the user becomes inactive | yes      | -             |
| **style**             | style    | The style of the wrapper                    | no       | { flex: 1 }   |
| **children**          | React    | Nested react nodes to wrap                  | yes      | -             |

## Contributing
Of course PRs are welcome!