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

    /**
     * @method getProducts
     * @param page - Número de página para la paginación (valor por defecto: 1).
     * @param limit - Límite de elementos por página (valor por defecto: 10).
     * @description Obtiene una lista paginada de productos desde la API.
     * @returns Un Observable que emite los productos paginados.
     */
    getProducts(page = 1, limit = 10): Observable<PaginatedProducts> {
        return this.http.get<PaginatedProducts>(
            `${this.apiUrl}products?page=${page}&limit=${limit}`,
        );
    }

    /**
     * @method updateProduct
     * @param product - Objeto del producto que se desea actualizar.
     * @description Actualiza un producto existente en la API.
     * @returns Un Observable que emite el producto actualizado y un mensaje de confirmación.
     */
    updateProduct(
        product: Product,
    ): Observable<{ product: Product; message: string }> {
        const { id, ...rest } = product;

        return this.http.put<{ product: Product; message: string }>(
            `${this.apiUrl}products/${id}`,
            rest,
        );
    }

    /**
     * @method deleteProduct
     * @param id - Identificador único del producto a eliminar.
     * @description Elimina un producto específico de la API.
     * @returns Un Observable que emite un mensaje de confirmación.
     */
    deleteProduct(id: number): Observable<Pick<PaginatedProducts, 'message'>> {
        return this.http.delete<Pick<PaginatedProducts, 'message'>>(
            `${this.apiUrl}products/${id}`,
        );
    }

    /**
     * @method addProduct
     * @param product - Objeto que contiene los datos del nuevo producto.
     * @description Agrega un nuevo producto a la API.
     * @returns Un Observable que emite el producto creado y un mensaje de confirmación.
     */
    addProduct(
        product: Pick<Product, 'name' | 'category' | 'price' | 'quantity'>,
    ): Observable<{ product: Product; message: string }> {
        return this.http.post<{ product: Product; message: string }>(
            `${this.apiUrl}products/`,
            product,
        );
    }
}
