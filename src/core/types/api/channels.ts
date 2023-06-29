import { ContractAddr } from '../contracts'

export type ExtractChannel = {
  id: string
  channelType: 'DM' | 'group' | 'server'
  recipients: ContractAddr[]
  name: string
}
