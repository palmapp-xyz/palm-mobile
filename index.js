// from rn-nodeify
import './shim'

// for uuid & web3
import 'react-native-get-random-values'

// for ethers
import '@ethersproject/shims'

// i18n
import './i18n.config'

import { configurePushNotification } from 'palm-react-native/notification'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import App from './src/palm-react-native-ui-kit/App'

AppRegistry.registerComponent(appName, () => App)

configurePushNotification()
