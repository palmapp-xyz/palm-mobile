# Palm

- Palm is a wallet-native, social mobile messenger built under the vision to become the open & composable entity-based messaging protocol for web3 communities.

- Open & composable mobile messenger for web3 social communities


## Available Scripts

If Yarn was installed when the project was initialized, then dependencies will have been installed, and you should probably use it to run these commands as well. Unlike dependency installation, command running syntax is identical for Yarn and NPM at the time of this writing.

### `npm start`

Runs your app in development mode.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
npm start -- --reset-cache
# or
yarn start -- --reset-cache
```

#### `npm run ios`

Like `npm start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

#### `npm run android`

Like `npm start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). We also recommend installing Genymotion as your Android emulator. Once you've finished setting up the native build environment, there are two options for making the right copy of `adb` available to Create React Native App:

### ENV

- You can easily make a chat with sendbird
- Get your Sendbird API Key. [Website](https://sendbird.com)

```
SENDBIRD_APP_ID=''
```

- You can use Alchemy for stable RPC node
- Get your Alchemy API Key. [Website](https://www.alchemy.com)
```
ALCHEMY_API_KEY=''
```



### Next Steps

- [ ] Open & composable vision: powered by Palm’s open-sourced, modularized Web3 Social Messaging Protocol
- [ ] Fully migrate toward the designed on-chain ECS based messaging protocol, building it as a modular system described above
- [ ] Do note that regular web2 messages are “not” (yet) designed to be on-chain within the ECS, but “only web3 messages” involving on-chain transactions
- - For example, in the current demo for this hackathon, only token transfer involved messages such as NFTTradeMessage, or NFTListMessage, NFTSendMessage are “modules”
- - For other modules, use your imagination! On-chain voting message? On-chain make proposal message? NFT lending offer message? Betting game message? etc.
- [ ] Open source! Let’s build together!
- [ ] Deal with mobile app stores...

