export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  bio?: string;
  avatarKey?: string;
  active: boolean;
  accountStatus: "active" | "suspended" | "banned";
  notificationPreferences: {
    inApp: NotificationToggles;
    email: NotificationToggles;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationToggles {
  followers: boolean;
  comments: boolean;
  likes: boolean;
  tips: boolean;
}

export interface Video {
  _id: string;
  title: string;
  description?: string;
  owner: Pick<User, "_id" | "username" | "avatarKey">;
  videoURL: string;
  key?: string;
  thumbnailKey?: string;
  duration: number;
  viewsCount: number;
  status: "public" | "private" | "flagged";
  likeCount?: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  user: Pick<User, "_id" | "username" | "avatarKey">;
  video: string;
  createdAt: string;
  updatedAt: string;
}

export interface Follower {
  _id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  actor: Pick<User, "_id" | "username">;
  type: "like" | "comment" | "follower" | "tip";
  channel: "inApp" | "email";
  video?: string;
  read: boolean;
  createdAt: string;
}

export interface Like {
  _id: string;
  user: string;
  video: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  videos: T[];
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  results?: number;
  message?: string;
}

export interface ApiError {
  status: "error";
  message: string;
}
