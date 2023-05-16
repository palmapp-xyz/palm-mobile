// from rn-nodeify
import './shim'

// for uuid & web3
import 'react-native-get-random-values'

// for ethers
import '@ethersproject/shims'

import { configurePushNotification } from 'libs/notification'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import App from './src/App'

AppRegistry.registerComponent(appName, () => App)

configurePushNotification()
