// Avatar.tsx
type AvatarProps = {
  user: {
    username: string;
    photo_profile?: string | null;
  } | null;   
  size?: number;
};

export default function Avatar({ user, size = 40 }: AvatarProps) {
  if (!user) {
    // fallback default kalau null
    return (
      <img
        src={`https://i.pravatar.cc/${size}?u=guest`}
        alt="guest"
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={
        user.photo_profile
          ? user.photo_profile
          : `https://i.pravatar.cc/${size}?u=${user.username}`
      }
      alt={user.username}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
