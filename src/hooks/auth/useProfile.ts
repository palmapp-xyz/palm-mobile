import { Profile, ProfileMedia } from 'graphqls/__generated__/graphql'
import useNetwork from 'hooks/complex/useNetwork'
import useFsProfile from 'hooks/firestore/useFsProfile'
import useLens from 'hooks/lens/useLens'
import useLensProfile from 'hooks/lens/useLensProfile'
import { fetchNftImage } from 'libs/fetchTokenUri'
import { formatValues } from 'libs/firebase'
import { getProfileMediaImg } from 'libs/lens'
import { recordError } from 'libs/logger'
import { profilesDeepCompare } from 'libs/profile'
import { useQuery } from 'react-query'
import { ContractAddr, FbProfile, Moralis, SupportedNetworkEnum, TrueOrErrReturn } from 'types'

import { ProfileMetadata } from '@lens-protocol/react-native-lens-ui-kit'
import { useAsyncEffect } from '@sendbird/uikit-utils'

export type UseProfileReturn = {
  profile: FbProfile | undefined
  lensProfile: Profile | undefined
  isLoadingLensProfile: boolean
  createProfile: (
    handle: string,
    createOnLens?: boolean
  ) => Promise<TrueOrErrReturn<FbProfile>>
  updateProfileImage: (
    item: Partial<Moralis.NftItem>,
    selectedNetwork: SupportedNetworkEnum
  ) => Promise<TrueOrErrReturn<string | undefined>>
  setMetadata: (metadata: Partial<ProfileMetadata>) => Promise<
    TrueOrErrReturn<
      | {
          metadata: any
          txHash: any
          txId: any
        }
      | undefined
    >
  >
}

const useProfile = ({
  profileId,
}: {
  profileId?: string
}): UseProfileReturn => {
  const { fsProfile, fsProfileField } = useFsProfile({ profileId })
  const { connectedNetworkIds } = useNetwork()

  const {
    profile: lensProfile,
    refetch: refetchLensProfile,
    isLoading: isLoadingLensProfile,
  } = useLensProfile({
    userAddress: fsProfileField?.address as ContractAddr,
  })

  const {
    createProfile: createLensProfile,
    updateProfileImage: updateLensProfileImage,
    setMetadata: setLensMetadata,
  } = useLens()

  useAsyncEffect(async () => {
    if (!fsProfile || !fsProfileField || !lensProfile) {
      return
    }
    if (profilesDeepCompare(fsProfileField, lensProfile) === false) {
      const profileUpdate: Partial<FbProfile> = formatValues<
        Partial<FbProfile>
      >({
        handle: lensProfile.handle,
        name: lensProfile.name || undefined,
        bio: lensProfile.bio || undefined,
        picture: lensProfile.picture || undefined,
        coverPicture: getProfileMediaImg(lensProfile.coverPicture) || undefined,
        attributes: lensProfile.attributes || undefined,
      })
      await fsProfile.update(profileUpdate)

      await fsProfile.update({
        handle: lensProfile.handle,
        bio: lensProfile.bio || undefined,
        picture: lensProfile.picture || undefined,
      } as Partial<FbProfile>)
    }
  }, [fsProfileField, lensProfile])

  useQuery(
    ['refetchUseLensProfile'],
    () => {
      refetchLensProfile()
    },
    { enabled: !!profileId, refetchInterval: 10000 }
  )

  const createProfile = async (
    handle: string,
    createOnLens?: boolean
  ): Promise<TrueOrErrReturn<FbProfile>> => {
    if (!fsProfile) {
      return { success: false, errMsg: 'user does not exist.' }
    }

    if (createOnLens) {
      try {
        const res = await createLensProfile({
          handle,
        })

        if (res.success) {
          await refetchLensProfile()
        } else {
          return { success: false, errMsg: res.errMsg }
        }
      } catch (error) {
        recordError(error, 'createLensProfile')
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }

    await fsProfile.update({ handle })
    return { success: true, value: { ...fsProfileField, handle } as FbProfile }
  }

  const updateProfileImage = async (
    item: Partial<Moralis.NftItem>,
    selectedNetwork: SupportedNetworkEnum
  ): Promise<TrueOrErrReturn<string | undefined>> => {
    if (!fsProfile) {
      return { success: false, errMsg: 'user does not exist.' }
    }

    if (!item.token_address || !item.token_id || !item.token_uri) {
      return {
        success: false,
        errMsg: `updateProfileImage: invalid nft item ${item}`,
      }
    }

    let txHash: string | undefined

    if (lensProfile) {
      try {
        const res = await updateLensProfileImage(
          lensProfile.id,
          item.token_address,
          item.token_id,
          selectedNetwork
        )

        if (res.success) {
          await refetchLensProfile()
          txHash = res.value
        } else {
          return res
        }
      } catch (error) {
        recordError(error, 'updateProfileImage:updateLensProfileImage')
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }

    try {
      const { image } = await fetchNftImage({
        nftContract: item.token_address,
        tokenId: item.token_id,
        metadata: item.metadata,
        tokenUri: item.token_uri,
      })

      const picture: ProfileMedia | undefined = formatValues<ProfileMedia>({
        __typename: 'NftImage',
        chainId: connectedNetworkIds[selectedNetwork]!,
        contractAddress: item.token_address!,
        tokenId: item.token_id!,
        uri: image!,
        verified: false,
      })
      await fsProfile.update({ picture })

      return { success: true, value: txHash }
    } catch (error) {
      recordError(error, 'updateProfileImage:fsProfile.update')
      return { success: false, errMsg: JSON.stringify(error) }
    }
  }

  const setMetadata = async (
    metadata: Partial<ProfileMetadata>
  ): Promise<
    TrueOrErrReturn<
      | {
          metadata: any
          txHash: any
          txId: any
        }
      | undefined
    >
  > => {
    if (!fsProfile) {
      return { success: false, errMsg: 'user does not exist.' }
    }

    if (
      metadata.appId ||
      metadata.metadata_id ||
      metadata.version ||
      metadata.signatureContext
    ) {
      return {
        success: false,
        errMsg: `setMetadata: unsupported metadata field included ${metadata}`,
      }
    }

    let value:
      | {
          metadata: any
          txHash: any
          txId: any
        }
      | undefined

    if (lensProfile) {
      const result = await setLensMetadata(lensProfile, metadata)
      if (!result.success) {
        return result
      } else {
        await refetchLensProfile()
        value = result.value
      }
    }

    try {
      const profileUpdate: Partial<FbProfile> = formatValues<
        Partial<FbProfile>
      >({
        name: metadata.name,
        bio: metadata.bio,
        coverPicture: metadata.cover_picture,
        attributes: metadata.attributes,
      })
      await fsProfile.update(profileUpdate)
      return { success: true, value }
    } catch (error) {
      recordError(error, 'setMetadata:fsProfile.update')
      return { success: false, errMsg: JSON.stringify(error) }
    }
  }

  return {
    profile: fsProfileField,
    lensProfile,
    isLoadingLensProfile,
    createProfile,
    updateProfileImage,
    setMetadata,
  }
}

export default useProfile
