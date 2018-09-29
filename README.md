# react-native-user-inactivity

React Native component that notifies if the user is active or not (i.e. when the app surface hasn't been touched for more than a certain amount of ms).

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

export default class App extends PureComponent {
  state = {
    active: true,
    text: ''
  };

  onAction = (active) => {
    this.setState({
      active,
    });
  }

  render() {
    const { active } = this.state;
    return (
      <UserInactivity
        timeForInactivity={2000}
        onAction={this.onAction}
      >
        <Text style={styles.paragraph}>
          Put your app here: 
          {
            active ? 'Active' : 'Inactive'
          }
        </Text>
      </UserInactivity>
    );
  }
}
```

Also, please checkout the [example on Snack/Expo](https://snack.expo.io/H1rlra2FX).

## Props
The time is expressed in milliseconds (*ms*).

| Prop                  | Type               | Explanation                                 | Required | Default Value |
| --------------------- |---------           | ------------------------------------------- | -------- | ------------- |
| **timeForInactivity** | number             | Inactivity time threshold                   | no       | 10000         |
| **onAction**          | (boolean) => void  | Callback triggered at every action, or lack of action after *timeForInactivity* ms      | yes      | -             |
| **style**             | style              | The style of the wrapper                    | no       | { flex: 1 }   |
| **children**          | React.ReactNode    | Nested react nodes to wrap                  | yes      | -             |

## Contributing
Of course PRs are welcome!