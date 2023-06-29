import { COLOR } from 'consts'
import React, { ReactElement, useEffect } from 'react'
import Spinner, { SpinnerPropTypes } from 'react-native-loading-spinner-overlay'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

const maxTimeout = 30000

const Loading = (props: SpinnerPropTypes): ReactElement => {
  const [loading, setLoading] = useRecoilState(appStore.loading)

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, maxTimeout)
    }
  }, [loading])

  return (
    <Spinner
      {...props}
      visible={loading}
      textStyle={{ color: COLOR.black._300, fontSize: 16 }}
    />
  )
}

export default Loading
