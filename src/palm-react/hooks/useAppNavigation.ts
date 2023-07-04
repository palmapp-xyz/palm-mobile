import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import type {
  ParamListBase,
  RouteParams,
  RouteParamsUnion,
  Routes,
  ScreenPropsNavigation,
  ScreenPropsRoute,
} from 'palm-core/libs/navigation'

export const useRouteParams = <T extends Routes>(): NonNullable<
  Readonly<RouteParams<T>> | undefined
> => {
  const { params } = useRoute<ScreenPropsRoute<T>>()
  return params as NonNullable<typeof params>
}

export const useAppNavigation = <T extends Routes>(): {
  navigation: NativeStackNavigationProp<
    ParamListBase<RouteParamsUnion>,
    T,
    undefined
  >
  params: NonNullable<Readonly<RouteParams<T>> | undefined>
} => {
  const navigation = useNavigation<ScreenPropsNavigation<T>>()
  const params = useRouteParams<T>()

  return { navigation, params }
}
