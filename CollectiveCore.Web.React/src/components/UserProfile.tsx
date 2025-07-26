import type { User } from '../types/user';

type UserProfileProps = {
  user: User;
};

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="user-profile card p-4">
      <h2>{user.userName}</h2>
      <p>Email: {user.email}</p>
      {/* Add more user details here later */}
    </div>
  );
}