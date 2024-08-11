export type User = {
  uid: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
}
