import React, { useEffect } from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import { WhiteBackground } from '../../components/WhiteBackground'
import Sizer from 'react-native-size'
import { userPrivateData } from '../../state/userPrivateData'
import { useSelfQR } from '../../state/qr'
import { applicationState } from '../../state/app-state'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Link } from '../../components/Base'
import { useResetTo } from '../../utils/navigation'
import { useNavigation } from 'react-navigation-hooks'
import { pushNotification } from '../../services/notification'

const MAX_SCORE = 100

export const MainApp = () => {
  const faceURI = userPrivateData.getData('faceURI')
  const isVerified = applicationState.get('isRegistered')
  const qr = useSelfQR()
  const resetTo = useResetTo()
  const navigation = useNavigation()
  useEffect(() => {
    pushNotification.configure()
  }, [])
  if (!qr) {
    return null
  }

  return (
    <WhiteBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/logo_header.png')}
            resizeMode="contain"
            style={{ height: 32, marginTop: 8, marginBottom: 4 }}
          />
        </View>
        <TouchableWithoutFeedback>
          <View
            style={{
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <CircularProgressAvatar
              image={faceURI ? { uri: faceURI } : void 0}
              color={qr.getStatusColor()}
              progress={(qr.getScore() / MAX_SCORE) * 100}
              width={Math.min(
                200,
                Math.floor((25 / 100) * Dimensions.get('screen').height),
              )}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            alignSelf: 'center',
            color: COLORS.GRAY_2,
            marginTop: 12,
            marginBottom: 8,
          }}
        >
          ข้อมูลวันที่ 26 มี.ค. 2563 16:45 น.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingBottom: 6,
            borderBottomColor: COLORS.GRAY_1,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../assets/covid.png')}
              style={{ width: 24, height: 24 }}
            />
            <View
              style={{
                alignItems: 'flex-start',
                flexDirection: 'column',
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 12,
                  color: COLORS.GRAY_2,
                }}
              >
                ความเสี่ยง
              </Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  marginTop: -4,
                  fontWeight: 'bold',
                  color: qr.getStatusColor(),
                }}
              >
                {qr.getLabel()}
              </Text>
            </View>
          </View>
        </View>
        <Sizer
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: COLORS.GRAY_1,
          }}
        >
          {({ height }) => {
            const size = height ? Math.min(300, height - 8) : void 0
            return size ? (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: qr.getQRImageURL(),
                }}
              />
            ) : (
              <ActivityIndicator size="large" />
            )
          }}
        </Sizer>
        {isVerified ? (
          void 0
        ) : (
          <TouchableOpacity
            onPress={() => {
              applicationState.set('skipRegistration', false)
              resetTo({
                routeName: 'Auth',
              })
              setTimeout(() => {
                navigation.navigate('AuthPhone')
              }, 0)
            }}
          >
            <Link style={{ marginTop: 6, fontWeight: 'bold' }}>
              ยืนยันตัวตน >
            </Link>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </WhiteBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  text: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 32,
    marginLeft: 8,
    color: COLORS.PRIMARY_LIGHT,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.RED,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
