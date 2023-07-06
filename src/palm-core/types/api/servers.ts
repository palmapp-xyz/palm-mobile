import { ContractAddr } from '../contracts'

export type ExtractServer = {
  id: string
  owner: ContractAddr
  description: string
  name: string
  categories: {
    id: string
    title: string
    channels: string[]
  }[]
}
