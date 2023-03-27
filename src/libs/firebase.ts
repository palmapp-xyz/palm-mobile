import firestore from '@react-native-firebase/firestore'
import { Profile } from 'graphqls/__generated__/graphql'
import { ContractAddr, User } from 'types'

export const createFsProfile = async (
  userAddress: string,
  lensProfile?: Profile
): Promise<User> => {
  const profile = firestore().collection('profiles').doc(userAddress)
  const profileDoc = await profile.get()

  let fsUser: User = {
    address: userAddress as ContractAddr,
    lensProfile,
    ...lensProfile,
  }

  if (!profileDoc.exists) {
    await profile.set(fsUser)
  } else {
    fsUser = (await profileDoc.data()) as User
  }
  return fsUser
}
