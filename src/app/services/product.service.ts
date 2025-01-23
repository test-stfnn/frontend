import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PaginatedProducts } from '@models/paginate.product.model';
import { Product } from '@models/product.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getProducts(page = 1, limit = 10): Observable<PaginatedProducts> {
        return this.http.get<PaginatedProducts>(
            `${this.apiUrl}products?page=${page}&limit=${limit}`,
        );
    }

    updateProduct(
        product: Product,
    ): Observable<{ product: Product; message: string }> {
        const { id, ...rest } = product;

        return this.http.put<{ product: Product; message: string }>(
            `${this.apiUrl}products/${id}`,
            rest,
        );
    }

    deleteProduct(id: number): Observable<Pick<PaginatedProducts, 'message'>> {
        return this.http.delete<Pick<PaginatedProducts, 'message'>>(
            `${this.apiUrl}products/${id}`,
        );
    }

    addProduct(
        product: Pick<Product, 'name' | 'category' | 'price' | 'quantity'>,
    ): Observable<{ product: Product; message: string }> {
        return this.http.post<{ product: Product; message: string }>(
            `${this.apiUrl}products/`,
            product,
        );
    }
}
