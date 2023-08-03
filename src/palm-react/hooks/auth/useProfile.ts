import { logEvent } from 'firebase/analytics'
import { analytics, updateDoc } from 'palm-core/firebase'
import { Profile, ProfileMedia } from 'palm-core/graphqls'
import { UTIL } from 'palm-core/libs'
import { fetchNftImage } from 'palm-core/libs/fetchTokenUri'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { recordError } from 'palm-core/libs/logger'
import { chainId } from 'palm-core/libs/network'
import { profilesDeepCompare } from 'palm-core/libs/profile'
import {
  ContractAddr,
  FbProfile,
  Moralis,
  SupportedNetworkEnum,
  TrueOrErrReturn,
} from 'palm-core/types'
import useFsProfile from 'palm-react/hooks/firestore/useFsProfile'
import useLens from 'palm-react/hooks/lens/useLens'
import useLensProfile from 'palm-react/hooks/lens/useLensProfile'

import { ProfileMetadata } from '@lens-protocol/react-native-lens-ui-kit'
import { useAsyncEffect } from '@sendbird/uikit-utils'

export type UseProfileReturn = {
  profile: FbProfile | undefined
  lensProfile: Profile | undefined
  isLoadingLensProfile: boolean
  createProfile: (
    handle: string,
    bio: string,
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

const useProfile = ({ profileId }: { profileId: string }): UseProfileReturn => {
  const { fsProfile, fsProfileField } = useFsProfile({ profileId })

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
    if (!fsProfileField || !lensProfile) {
      return
    }
    if (profilesDeepCompare(fsProfileField, lensProfile) === false) {
      const profileUpdate: Partial<FbProfile> = UTIL.filterUndefined<
        Partial<FbProfile>
      >({
        handle: lensProfile.handle,
        name: lensProfile.name || undefined,
        bio: lensProfile.bio || undefined,
        picture: lensProfile.picture || undefined,
        coverPicture: getProfileMediaImg(lensProfile.coverPicture) || undefined,
        attributes: lensProfile.attributes || undefined,
      })
      await updateDoc(fsProfile!, profileUpdate)
    }
  }, [fsProfileField, lensProfile])

  const createProfile = async (
    handle: string,
    bio: string,
    createOnLens?: boolean
  ): Promise<TrueOrErrReturn<FbProfile>> => {
    if (!fsProfile) {
      return { success: false, errMsg: 'user does not exist.' }
    }

    logEvent(analytics, 'create_profile')

    if (createOnLens) {
      try {
        const res = await createLensProfile({
          handle,
        })

        if (res.success) {
          const result = await setMetadata({ bio } as Partial<ProfileMetadata>)
          if (!result.success) {
            recordError(new Error(result.errMsg), 'createProfile:setMetadata')
          }
          await refetchLensProfile()
        } else {
          return { success: false, errMsg: res.errMsg }
        }
      } catch (error) {
        recordError(error, 'createLensProfile')
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }
    await updateDoc(fsProfile, { handle, bio } as FbProfile)
    return {
      success: true,
      value: { ...fsProfileField, handle, bio } as FbProfile,
    }
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

    logEvent(analytics, 'update_profile_image')

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

      const picture: ProfileMedia | undefined =
        UTIL.filterUndefined<ProfileMedia>({
          __typename: 'NftImage',
          chainId: chainId(selectedNetwork),
          contractAddress: item.token_address!,
          tokenId: item.token_id!,
          uri: image!,
          verified: false,
        })
      await updateDoc(fsProfile, { picture } as FbProfile)

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

    logEvent(analytics, 'update_profile_metadata')

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
      const profileUpdate: Partial<FbProfile> = UTIL.filterUndefined<
        Partial<FbProfile>
      >({
        name: metadata.name,
        bio: metadata.bio,
        coverPicture: metadata.cover_picture,
        attributes: metadata.attributes,
      })
      await updateDoc(fsProfile, profileUpdate)
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
