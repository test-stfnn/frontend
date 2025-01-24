import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { PaginatedProducts } from '@models/paginate.product.model';
import { Product } from '@models/product.model';

import { ProductService } from './product.service';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService],
        });
        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch paginated products', () => {
        const mockResponse: PaginatedProducts = {
            products: [
                {
                    id: 1,
                    name: 'Product A',
                    category: 'Category A',
                    price: 100,
                    quantity: 10,
                },
            ],
            total: 1,
            message: 'Success',
            page: 1,
            limit: 10,
        };

        service.getProducts(1, 10).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
            `${environment.apiUrl}products?page=1&limit=10`,
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch paginated products without params', () => {
        const mockResponse: PaginatedProducts = {
            products: [
                {
                    id: 1,
                    name: 'Product A',
                    category: 'Category A',
                    price: 100,
                    quantity: 10,
                },
            ],
            total: 1,
            message: 'Success',
            page: 1,
            limit: 10,
        };

        service.getProducts().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
            `${environment.apiUrl}products?page=1&limit=10`,
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should update the product', () => {
        const product: Product = {
            id: 1,
            name: 'Updated Product',
            category: 'Updated Category',
            price: 200,
            quantity: 5,
        };
        const mockResponse = { product, message: 'Product updated successfully' };

        service.updateProduct(product).subscribe((response) => {
            expect(response.product).toEqual(product);
            expect(response.message).toBe('Product updated successfully');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}products/1`);
        expect(req.request.method).toBe('PUT');
        req.flush(mockResponse);
    });

    it('should delete the product', () => {
        const mockResponse = { message: 'Product deleted successfully' };

        service.deleteProduct(1).subscribe((response) => {
            expect(response.message).toBe('Product deleted successfully');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}products/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
    });

    it('should add a new product', () => {
        const newProduct = {
            name: 'New Product',
            category: 'New Category',
            price: 300,
            quantity: 10,
        };
        const addedProduct: Product = { id: 2, ...newProduct };
        const mockResponse = {
            product: addedProduct,
            message: 'Product added successfully',
        };

        service.addProduct(newProduct).subscribe((response) => {
            expect(response.product).toEqual(addedProduct);
            expect(response.message).toBe('Product added successfully');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}products/`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });
});
