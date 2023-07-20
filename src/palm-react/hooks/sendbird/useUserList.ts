import { useMemo, useRef, useState } from 'react'

import { User } from '@sendbird/chat'
import type { SendbirdChatSDK, UserStruct } from '@sendbird/uikit-utils'
import {
  Logger,
  SBErrorCode,
  SBErrorMessage,
  useAsyncEffect,
  useFreshCallback,
} from '@sendbird/uikit-utils'

export interface CustomQueryInterface<Data> {
  isLoading: boolean
  next: () => Promise<Data[]>
  hasNext: boolean
}

export interface UseUserListReturn {
  loading: boolean
  refreshing: boolean
  error: unknown | null
  refresh: () => Promise<void>
  users: User[]
  upsertUser: (user: User) => void
  deleteUser: (userId: User['userId']) => void
  hasNext: boolean
  next: () => Promise<void>
}

export type UseUserListOptions<User extends UserStruct> = {
  sortComparator?: (a: User, b: User) => number
}

const createUserQuery = <User extends UserStruct>(
  sdk: SendbirdChatSDK
): CustomQueryInterface<User> => {
  return sdk.createApplicationUserListQuery() as unknown as CustomQueryInterface<User>
}

export const useUserList = (
  sdk: SendbirdChatSDK,
  options?: UseUserListOptions<User>
): UseUserListReturn => {
  const query = useRef<CustomQueryInterface<User>>()

  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [users, setUsers] = useState<User[]>([])
  const sortedUsers = useMemo((): User[] => {
    if (options?.sortComparator) {
      return users.sort(options.sortComparator)
    }
    return users
  }, [users, options?.sortComparator])

  const upsertUser = useFreshCallback((user: User) => {
    setUsers(([...draft]) => {
      const userIdx = draft.findIndex(it => it.userId === user.userId)
      if (userIdx > -1) {
        draft[userIdx] = user
      } else {
        draft.push(user)
      }
      return draft
    })
  })

  const deleteUser = useFreshCallback((userId: User['userId']) => {
    setUsers(([...draft]) => {
      const userIdx = draft.findIndex(it => it.userId === userId)
      if (userIdx > -1) {
        draft.splice(userIdx, 1)
      }
      return draft
    })
  })

  const updateUsers = (queriedUser: User[], clearPrev: boolean): void => {
    if (clearPrev) {
      setUsers(queriedUser)
    } else {
      setUsers(prev => prev.concat(queriedUser))
    }
  }

  const init = useFreshCallback(async () => {
    query.current = createUserQuery<User>(sdk)
    if (query.current?.hasNext) {
      const nextUsers = await query.current?.next().catch(e => {
        Logger.error(e)
        if (e.code === SBErrorCode.UNAUTHORIZED_REQUEST) {
          Logger.warn(SBErrorMessage.ACL)
        }
        throw e
      })
      updateUsers(nextUsers, true)
    }
  })

  useAsyncEffect(async () => {
    setLoading(true)
    setError(null)
    try {
      await init()
    } catch (e) {
      setError(e)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useFreshCallback(async () => {
    setRefreshing(true)
    setError(null)
    try {
      await init()
    } catch (e) {
      setError(e)
      setUsers([])
    } finally {
      setRefreshing(false)
    }
  })

  const next = useFreshCallback(async () => {
    if (query.current && query.current?.hasNext) {
      const nextUsers = await query.current.next().catch(e => {
        Logger.error(e)
        if (e.code === SBErrorCode.UNAUTHORIZED_REQUEST) {
          Logger.warn(SBErrorMessage.ACL)
        }
        throw e
      })
      updateUsers(nextUsers, false)
    }
  })

  return {
    loading,
    error,
    users: sortedUsers as User[],
    upsertUser,
    deleteUser,
    hasNext: query.current?.hasNext ?? false,
    next,
    refreshing,
    refresh,
  }
}

export default createUserQuery
