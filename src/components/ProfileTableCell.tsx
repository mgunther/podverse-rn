import React from 'react'
import { StyleSheet } from 'react-native'
import { PV } from '../resources'
import { Text, View } from './'

type Props = {
  name?: string
  onPress?: any
}

export const ProfileTableCell = (props: Props) => {
  const { name, onPress } = props

  return (
      <View style={styles.wrapper}>
        <Text
          onPress={onPress}
          style={styles.name}>
          {name || 'anonymous'}
        </Text>
      </View>
  )
}

const styles = StyleSheet.create({
  name: {
    flex: 1,
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.semibold,
    height: 50,
    lineHeight: 50
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8
  }
})