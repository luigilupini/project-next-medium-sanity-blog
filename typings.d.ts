// Here is all our prop `types/interface` definitions:
// We are defining our `props` structure!
export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
  comments: Comment[];
}

export interface Comment {
  approved: boolean;
  _id: string;
  _createdAt: string;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
  _rev: string;
  _type: string;
  updatedAt: string;
}
