export interface Profile {
  id: string;
  name: string;
  age: string;
  description: string;
  contactNumber: string;
  images: string[];
  gender: 'male' | 'female';
  location: string;
}
