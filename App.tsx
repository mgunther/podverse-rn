import AsyncStorage from '@react-native-community/async-storage'
import React, { Component } from 'react'
import { Image, Platform, StatusBar, View } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import { setGlobal } from 'reactn'
import { GlobalTheme } from 'src/resources/Interfaces'
import { PV } from './src/resources'
import Router from './src/Router'
import initialState from './src/state/initialState'
import { darkTheme, lightTheme } from './src/styles'
type Props = {}

type State = {
  appReady: boolean
}

setGlobal(initialState)

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    StatusBar.setBarStyle('light-content')
    Platform.OS === 'android' && StatusBar.setBackgroundColor(PV.Colors.brandColor)
    this.state = {
      appReady: false
    }
  }

  async componentDidMount() {
    TrackPlayer.registerPlaybackService(() => require('./src/services/playerEvents'))
    const darkModeEnabled = await AsyncStorage.getItem(PV.Keys.DARK_MODE_ENABLED)
    this.setupGlobalState(darkModeEnabled === 'TRUE' || darkModeEnabled === null ? darkTheme : lightTheme)
  }

  setupGlobalState(theme: GlobalTheme) {
    setGlobal({
      globalTheme: theme
    }, () => {
      this.setState({ appReady: true })
    })
  }

  _renderIntersitial = () => {
    return (
      <View style={{ backgroundColor: PV.Colors.brandColor, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={PV.Images.BANNER} resizeMode='contain' />
      </View>
    )
  }

  render() {
    return this.state.appReady ? <Router /> : this._renderIntersitial()
  }
}

export default App
