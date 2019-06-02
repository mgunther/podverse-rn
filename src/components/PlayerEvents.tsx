import { Alert, StyleSheet, View } from 'react-native'
import React from 'reactn'
import { PV } from '../resources'
import { getNowPlayingItem } from '../services/player'
import PlayerEventEmitter from '../services/playerEventEmitter'
import { playNextFromQueue, setNowPlayingItem, updatePlaybackState } from '../state/actions/player'

type Props = {}

type State = {}

export class PlayerEvents extends React.PureComponent<Props, State> {

  componentDidMount() {
    PlayerEventEmitter.on(PV.Events.PLAYER_CANNOT_STREAM_WITHOUT_WIFI, this._playerCannotStreamWithoutWifi)
    PlayerEventEmitter.on(PV.Events.PLAYER_QUEUE_ENDED, this._playerQueueEnded)
    PlayerEventEmitter.on(PV.Events.PLAYER_REMOTE_NEXT, this._refreshNowPlayingItem)
    PlayerEventEmitter.on(PV.Events.PLAYER_REMOTE_PAUSE, this._playerStateUpdated)
    PlayerEventEmitter.on(PV.Events.PLAYER_REMOTE_PLAY, this._playerStateUpdated)
    PlayerEventEmitter.on(PV.Events.PLAYER_REMOTE_PREVIOUS, this._refreshNowPlayingItem)
    PlayerEventEmitter.on(PV.Events.PLAYER_REMOTE_STOP, this._playerStateUpdated)
    PlayerEventEmitter.on(PV.Events.PLAYER_RESUME_AFTER_CLIP_HAS_ENDED, this._refreshNowPlayingItem)
    PlayerEventEmitter.on(PV.Events.PLAYER_STATE_CHANGED, this._playerStateUpdated)
  }

  componentWillUnmount() {
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_CANNOT_STREAM_WITHOUT_WIFI)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_QUEUE_ENDED)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_REMOTE_NEXT)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_REMOTE_PAUSE)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_REMOTE_PLAY)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_REMOTE_PREVIOUS)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_REMOTE_STOP)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_RESUME_AFTER_CLIP_HAS_ENDED)
    PlayerEventEmitter.removeListener(PV.Events.PLAYER_STATE_CHANGED)
  }

  _playerCannotStreamWithoutWifi = async () => {
    await Alert.alert(
      PV.Alerts.PLAYER_CANNOT_STREAM_WITHOUT_WIFI.title, PV.Alerts.PLAYER_CANNOT_STREAM_WITHOUT_WIFI.message, []
    )
  }

  _playerQueueEnded = async () => {
    const { player, session } = this.global
    const { shouldContinuouslyPlay, showMakeClip } = player
    const { queueItems } = session.userInfo

    if (!showMakeClip.isShowing && shouldContinuouslyPlay && queueItems.length > 0) {
      await playNextFromQueue(session.isLoggedIn, this.global)
    }
  }

  _playerStateUpdated = async () => {
    await updatePlaybackState(this.global)
  }

  _refreshNowPlayingItem = async () => {
    const nowPlayingItem = await getNowPlayingItem()
    await setNowPlayingItem(nowPlayingItem, this.global)
  }

  render() {
    return (
      <View style={styles.view} />
    )
  }
}

const styles = StyleSheet.create({
  view: {
    height: 0,
    width: 0
  }
})