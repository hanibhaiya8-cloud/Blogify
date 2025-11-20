export interface Profile {
  _id?: string;
  id?: string; // For backward compatibility
  heading: string;
  description: string;
  location: string;
  contactNumber: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}
