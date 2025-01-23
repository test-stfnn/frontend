import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductService } from '@services/product.service';
import { of, throwError } from 'rxjs';

import { DeleteProductComponent } from './delete.product.component';

describe('DeleteProductComponent', () => {
    let component: DeleteProductComponent;
    let fixture: ComponentFixture<DeleteProductComponent>;
    let mockProductService: jasmine.SpyObj<ProductService>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteProductComponent>>;

    const productData = {
        id: 123,
        name: 'Test Product',
        category: 'Category',
        price: 10.0,
        quantity: 1,
    }; // Mock data

    beforeEach(async () => {
        mockProductService = jasmine.createSpyObj('ProductService', [
            'deleteProduct',
        ]);
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            providers: [
                { provide: ProductService, useValue: mockProductService },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: productData },
                provideAnimations(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteProductComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('onDelete', () => {
        it('should call deleteProduct and close the dialog with success status', () => {
            const mockResponse = { message: 'Product deleted successfully' };
            mockProductService.deleteProduct.and.returnValue(of(mockResponse));

            component.onDelete(new Event('click'));

            expect(mockProductService.deleteProduct).toHaveBeenCalledWith(
                productData.id,
            );
            expect(mockDialogRef.close).toHaveBeenCalledWith({
                status: 'ok',
                message: mockResponse,
            });
        });

        it('should handle errors and close the dialog with error status', () => {
            const mockError = { error: 'Failed to delete product' };
            mockProductService.deleteProduct.and.returnValue(throwError(mockError));

            component.onDelete(new Event('click'));

            expect(mockProductService.deleteProduct).toHaveBeenCalledWith(
                productData.id,
            );
            expect(mockDialogRef.close).toHaveBeenCalledWith({
                status: 'error',
                message: mockError,
            });
        });
    });

    describe('onCancel', () => {
        it('should close the dialog with cancel status', () => {
            component.onCancel(new Event('click'));

            expect(mockDialogRef.close).toHaveBeenCalledWith({
                status: 'cancel',
                message: 'No se elimina el producto',
            });
        });
    });
});
