export interface User {
  id: String;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  ingredients: Object[];
  steps: Object[];
  images: Object[];
  notifications: Object[];
  profile_image: string;
  created_at: string;
  updated_at: string;
  bookmarks: Object[];
}
