import axios, * as axiosjs from 'axios'
import _ from 'lodash'
import Config from 'palm-react-native/config'

import {
  ApiEnum,
  ApiFetchResult,
  ApiParamFabricated,
  ApiParams,
  ApiResponse,
} from '../types'

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

class ApiManager {
  apiPath: string
  accessToken?: string
  axios: axiosjs.AxiosInstance

  constructor(apiPath: string, accessToken?: string, interceptor?: any) {
    this.apiPath = apiPath
    this.accessToken = accessToken
    this.axios = axiosjs.default.create({
      baseURL: apiPath,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    })
    if (interceptor) {
      this.axios.interceptors.request.use(interceptor)
    }
  }

  setAccessToken = (accessToken: string): void => {
    this.accessToken = accessToken
    this.axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  setInterceptor = (interceptor: any): void => {
    this.axios.interceptors.request.use(interceptor)
  }

  get = async <T extends ApiEnum>({
    path,
  }: {
    path: ApiParamFabricated
  }): Promise<ApiFetchResult<ApiResponse[T]['GET']>> => {
    try {
      const apiUrl = `${this.apiPath}${path}`

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['GET'], any> =
        await axios.get(apiUrl, {
          headers: {
            Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
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

  post = async <T extends ApiEnum>({
    path,
    params,
    useFormData,
  }: {
    path: ApiParamFabricated
    params: ApiParams[T]['POST']
    useFormData?: boolean
  }): Promise<ApiFetchResult<ApiResponse[T]['POST']>> => {
    try {
      const apiUrl = `${this.apiPath}${path}`

      const formData = getFormData(params)

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['POST'], any> =
        await axios.post(apiUrl, useFormData ? formData : params, {
          headers: {
            Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
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
    }
  }

  put = async <T extends ApiEnum>({
    path,
    params,
    useFormData = false,
  }: {
    path: ApiParamFabricated
    params: ApiParams[T]['PUT']
    useFormData?: boolean
  }): Promise<ApiFetchResult<ApiResponse[T]['PUT']>> => {
    try {
      const apiUrl = `${this.apiPath}${path}`

      const formData = getFormData(params)

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['PUT'], any> =
        await axios.put(apiUrl, useFormData ? formData : params, {
          headers: {
            Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
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

  delApi = async <T extends ApiEnum>({
    path,
    params,
  }: {
    path: ApiParamFabricated
    params: ApiParams[T]['DEL']
  }): Promise<ApiFetchResult<ApiResponse[T]['DEL']>> => {
    try {
      const apiUrl = `${this.apiPath}${path}`

      const fetchRes: axiosjs.AxiosResponse<ApiResponse[T]['DEL'], any> =
        await axios.delete(apiUrl, {
          data: params,
          headers: {
            Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
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
}

export const apiManager = new ApiManager(Config.OEDI_API || '')
