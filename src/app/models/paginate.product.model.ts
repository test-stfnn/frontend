import { Product } from './product.model';

export interface PaginatedProducts {
  page: number;
  limit: number;
  total: number;
  products: Product[]; // The array of Product objects
  message: string;
}
