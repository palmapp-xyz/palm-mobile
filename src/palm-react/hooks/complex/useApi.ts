import * as axiosjs from 'axios'
import _ from 'lodash'
import { apiPath } from 'palm-core/consts'
import { appAuth, User as AuthUser } from 'palm-core/firebase'
import { recordError } from 'palm-core/libs/logger'
import {
  ApiEnum,
  ApiFetchResult,
  ApiParamFabricated,
  ApiParams,
  ApiResponse,
} from 'palm-core/types'
import useAuth from 'palm-react/hooks/auth/useAuth'
import fetchApiStore from 'palm-react/store/fetchApiStore'
import { useSetRecoilState } from 'recoil'

export type UseApiReturn = {
  getApi: <T extends ApiEnum>(props: {
    path: ApiParamFabricated
  }) => Promise<ApiFetchResult<ApiResponse[T]['GET']>>
  postApi: <T extends ApiEnum>(props: {
    path: ApiParamFabricated
    params: ApiParams[T]['POST']
    useFormData?: boolean
  }) => Promise<ApiFetchResult<ApiResponse[T]['POST']>>
  putApi: <T extends ApiEnum>(props: {
    path: ApiParamFabricated
    params: ApiParams[T]['PUT']
    useFormData?: boolean
  }) => Promise<ApiFetchResult<ApiResponse[T]['PUT']>>
  delApi: <T extends ApiEnum>(props: {
    path: ApiParamFabricated
    params: ApiParams[T]['DEL']
  }) => Promise<ApiFetchResult<ApiResponse[T]['DEL']>>
}

const handleErrorMessage = (error?: any): string => {
  if (error?.data?.message) {
    return _.toString(error.data.message)
  }
  return _.toString(error)
}

const getFormData = <T extends ApiEnum>(
  params: ApiParams[T]['PUT'] | ApiParams[T]['POST']
): FormData => {
  const formData = new FormData()
  if (params) {
    _.forEach(params, (val: any, key) => {
      if (val) {
        if (key === 'file_1') {
          val = new Blob([val], {
            type: 'application/octet-stream',
            lastModified: new Date().getTime(),
          })
        } else {
          val = new Blob([JSON.stringify(val)], {
            type: 'application/json',
            lastModified: new Date().getTime(),
          })
        }
        formData.append(key, val)
      }
    })
  }
  return formData
}

const useApi = (): UseApiReturn => {
  const { user } = useAuth()
  const accessToken = user?.auth?.authToken
  const setIsFetchingPutApiStore = useSetRecoilState(
    fetchApiStore.isFetchingPutApiStore
  )
  const setIsFetchingPostApiStore = useSetRecoilState(
    fetchApiStore.isFetchingPostApiStore
  )
  const setIsFetchingDelApiStore = useSetRecoilState(
    fetchApiStore.isFetchingDelApiStore
  )

  const axios = axiosjs.default.create({
    baseURL: apiPath,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  })
  axios.interceptors.request.use(async req => {
    try {
      const currentUser: AuthUser | null = appAuth.currentUser
      if (currentUser) {
        await currentUser.getIdTokenResult(true)
      }
    } catch (e) {
      recordError(e, 'useApi request interceptor')
    }
    return req
  })

  const getApi = async <T extends ApiEnum>({
    path,
  }: {
    path: ApiParamFabricated
  }): Promise<ApiFetchResult<ApiResponse[T]['GET']>> => {
    try {
      const apiUrl = `${apiPath}${path}`

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['GET'], any> =
        await axios.get(apiUrl, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        })

      if (fetchRes.status === 200) {
        return { success: true, data: fetchRes.data }
      }

      throw new Error(fetchRes.statusText)
    } catch (error) {
      const errMsg = handleErrorMessage(error)
      return {
        success: false,
        errMsg,
      }
    }
  }

  const postApi = async <T extends ApiEnum>({
    path,
    params,
    useFormData,
  }: {
    path: ApiParamFabricated
    params: ApiParams[T]['POST']
    useFormData?: boolean
  }): Promise<ApiFetchResult<ApiResponse[T]['POST']>> => {
    setIsFetchingPostApiStore(true)
    try {
      const apiUrl = `${apiPath}${path}`

      const formData = getFormData(params)

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['POST'], any> =
        await axios.post(apiUrl, useFormData ? formData : params, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
          params,
        })

      if (fetchRes.status === 200) {
        return { success: true, data: fetchRes.data }
      }

      throw new Error(fetchRes.statusText)
    } catch (error) {
      const errMsg = handleErrorMessage(error)
      return {
        success: false,
        errMsg,
      }
    } finally {
      setIsFetchingPostApiStore(false)
    }
  }

  const putApi = async <T extends ApiEnum>({
    path,
    params,
    useFormData = false,
  }: {
    path: ApiParamFabricated
    params: ApiParams[T]['PUT']
    useFormData?: boolean
  }): Promise<ApiFetchResult<ApiResponse[T]['PUT']>> => {
    setIsFetchingPutApiStore(true)

    try {
      const apiUrl = `${apiPath}${path}`

      const formData = getFormData(params)

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['PUT'], any> =
        await axios.put(apiUrl, useFormData ? formData : params, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        })

      if (fetchRes.status === 200) {
        return { success: true, data: fetchRes.data }
      }

      throw new Error(fetchRes.statusText)
    } catch (error) {
      const errMsg = handleErrorMessage(error)
      return {
        success: false,
        errMsg,
      }
    } finally {
      setIsFetchingPutApiStore(false)
    }
  }

  const delApi = async <T extends ApiEnum>({
    path,
    params,
  }: {
    path: ApiParamFabricated
    params: ApiParams[T]['DEL']
  }): Promise<ApiFetchResult<ApiResponse[T]['DEL']>> => {
    setIsFetchingDelApiStore(true)

    try {
      const apiUrl = `${apiPath}${path}`

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['DEL'], any> =
        await axios.delete(apiUrl, {
          data: params,
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        })

      if (fetchRes.status === 200) {
        return { success: true, data: fetchRes.data }
      }

      throw new Error(fetchRes.statusText)
    } catch (error) {
      const errMsg = handleErrorMessage(error)
      return {
        success: false,
        errMsg,
      }
    } finally {
      setIsFetchingDelApiStore(false)
    }
  }

  return { getApi, postApi, putApi, delApi }
}

export default useApi
