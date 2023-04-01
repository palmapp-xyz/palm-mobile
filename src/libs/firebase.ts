import { Maybe } from '@toruslabs/openlogin'
import _ from 'lodash'

export const formatValues = <T>(object: Maybe<T>): Maybe<T> => {
  if (!object) {
    return object
  }
  return _.omit(
    object,
    _.filter(_.keys(object), function (key) {
      return _.isUndefined(object[key])
    })
  ) as T
}
