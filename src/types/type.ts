interface Benefits {
  id: number;
  name: string;
}

interface Photo {
  id: number;
  photo: string;
}

interface Testimonial {
  id: number;
  name: string;
  message: string;
  photo: string;
  rating: number;
}

export interface Cosmetic {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  is_popular: boolean;
  category: Category;
  brand: Brand;
  benefits: Benefits[];
  photos: Photo[];
  testimonials: Testimonial[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  photo: string;
  cosmetics_count: number;
  cosmetics: Cosmetic[];
  popular_cosmetics: Cosmetic[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  photo: string;
  cosmetics_count: number;
  cosmetics: Cosmetic[];
  popular_cosmetics: Cosmetic[];
}

export interface BookingDetails {
  id: number;
  name: string;
  phone: number;
  email: string;
  booking_trx_id: string;
  proof: string | null;
  total_amount: number;
  total_tax_amount: number;
  is_paid: boolean;
  address: string;
  post_code: string;
  city: string;
  sub_total_amount: number;
  quantity: number;
  transaction_details: TransactionDetails[];
}

export interface TransactionDetails {
  id: number;
  price: number;
  cosmetic_id: number;
  quantity: number;
  cosmetic: Cosmetic;
}

export interface CartItem {
  cosmetic_id: number;
  slug: string;
  quantity: number;
}

export type BookingFormData = {
    name: string;
    phone: string;
    email: string;
    address: string;
    post_code: string;
    city: string;
    };