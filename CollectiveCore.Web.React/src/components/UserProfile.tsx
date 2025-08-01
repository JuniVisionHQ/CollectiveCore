import type { User } from '../types/user';

type UserProfileProps = {
  user: User;
};

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="user-profile">
      <h2 className="text-xl font-semibold mb-1">User Profile: {user.userName}</h2>
      {/* <p className="">Email: {user.email}</p> */}
      {/* Add more user details here later */}
    </div>
  );
}