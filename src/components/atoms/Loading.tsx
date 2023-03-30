import { COLOR } from 'consts'
import React, { ReactElement, useEffect } from 'react'
import Spinner, { SpinnerPropTypes } from 'react-native-loading-spinner-overlay'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

const maxTimeout = 10000

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
      textContent={'Loading...'}
      textStyle={{ color: COLOR.gray._300, fontSize: 16 }}
    />
  )
}

export default Loading
