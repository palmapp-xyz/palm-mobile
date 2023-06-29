import { IPFSResolverOptions } from 'types'

const defaultIpfsGateway = 'https://gateway.ipfscdn.io/ipfs/'

const defaultIpfsResolverOptions: IPFSResolverOptions = {
  gatewayUrl: defaultIpfsGateway,
}

export default {
  defaultIpfsGateway,
  defaultIpfsResolverOptions,
}
