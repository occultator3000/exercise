declare module '*.png' {
  const value: any;
  export default value;
}
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.webp';
declare module '*.json';
declare module '*.js';

type ArticleComment = {
  userName: string;
  avatarUrl: string;
  message: string;
  dateTime: string;
  location: string;
  favoriteCount: number;
  isFavorite: boolean;
  children?: ArticleComment[];
};

type Article = {
  id: number;
  title: string;
  desc: string; //描述
  tag?: string[];
  dateTime: string;
  location: string;
  userId: number;
  userName: string;
  isFollow: boolean;
  avatarUrl: string;
  images: string[];
  favoriteCount: number;
  collectionCount: number;
  isFavorite: boolean;
  isCollection: boolean;
  comments?: ArticleComment[];
};

type ArticleSimple = {
  id: string;
  title: string;
  userName: string;
  avatarUrl: string;
  favoriteCount: number;
  isFavorite: boolean;
  image: string;
};

type Category = {
  name: string;
  default: boolean;
  isAdd: boolean;
};

type GoodsSimple = {
  id: number;
  title: string;
  image: string;
  price: string;
  originPrice: number | undefined;
  promotion: string | undefined; //促销信息
};

type GoodsCategory = {
  id: number;
  name;
  string;
  image: string;
};

type MessageListItem = {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage?: string;
  lastMessageTime?: string;
};

type Unread = {
  unreadFavorite: number;
  newFollow: number;
  comment: number;
};
