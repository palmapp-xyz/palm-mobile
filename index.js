// from rn-nodeify
import './shim'

// for uuid & web3
import 'react-native-get-random-values'

// for ethers
import '@ethersproject/shims'

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
