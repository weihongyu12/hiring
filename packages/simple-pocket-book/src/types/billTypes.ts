import { PaginationResponse, Order } from './httpTypes';
import { Category } from './categoryTypes';

export interface Bill {
  type: 0 | 1;
  time: string;
  amount: number;
  categoryId: string;
  category: Category;
}

export interface BillIndexRequest {
  page?: number;
  perPage?: number;
  order?: Order;
  sortBy?: string;
}

export type BillIndexResponse = PaginationResponse<Bill[]>;
