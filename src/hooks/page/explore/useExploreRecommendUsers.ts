export type UseExploreRecommendUsersReturn = {
  userList: UserItem[]
}

export type UserItem = {
  id: string
  img: any
  name: string
  follower: number
  following: number
  nftTotalAmount: number
}
const userList: UserItem[] = [
  {
    id: '1',
    img: require('assets/temp/thumbs9.png'),
    name: 'Username1 Username Username',
    follower: 23423,
    following: 23343434,
    nftTotalAmount: 234,
  },

  {
    id: '2',
    img: require('assets/temp/thumbs8.png'),
    name: 'Username2 Username Username',
    follower: 42,
    following: 2423,
    nftTotalAmount: 0,
  },
  {
    id: '3',
    img: require('assets/temp/thumbs7.png'),
    name: 'Username3 Username Username',
    follower: 553432234,
    following: 1756,
    nftTotalAmount: 234,
  },
]

const useExploreRecommendUsers = (): UseExploreRecommendUsersReturn => {
  return {
    userList,
  }
}

export default useExploreRecommendUsers
