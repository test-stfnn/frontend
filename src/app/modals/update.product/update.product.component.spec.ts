import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductService } from '@services/product.service';
import { of, throwError } from 'rxjs';

import { UpdateProductComponent } from './update.product.component';

const mockDialogRef = {
    close: jasmine.createSpy('close'),
};

const mockProductService = {
    updateProduct: jasmine.createSpy('updateProduct').and.returnValue(
        of({
            product: { id: 1, name: 'Updated Product' },
            message: 'Product updated successfully',
        }),
    ),
};

describe('UpdateProductComponent', () => {
    let component: UpdateProductComponent;
    let fixture: ComponentFixture<UpdateProductComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        id: 1,
                        name: 'Test Product',
                        category: 'Test Category',
                        price: 100,
                        quantity: 10,
                    },
                },
                { provide: ProductService, useValue: mockProductService },
                provideAnimations(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with data', () => {
        expect(component.updateProductForm.value).toEqual({
            name: 'Test Product',
            category: 'Test Category',
            price: 100,
            quantity: 10,
        });
    });

    it('should validate the form fields', () => {
        const nameControl = component.updateProductForm.get('name');
        nameControl?.setValue('');
        expect(nameControl?.valid).toBeFalse();
        nameControl?.setValue('Valid Name');
        expect(nameControl?.valid).toBeTrue();

        const priceControl = component.updateProductForm.get('price');
        priceControl?.setValue(-10);
        expect(priceControl?.valid).toBeFalse();
        priceControl?.setValue(10);
        expect(priceControl?.valid).toBeTrue();
    });

    it('should call ProductService.updateProduct and close the dialog on valid form submission', () => {
        component.updateProductForm.setValue({
            name: 'Updated Name',
            category: 'Updated Category',
            price: 150,
            quantity: 5,
        });

        component.onSubmit();

        expect(mockProductService.updateProduct).toHaveBeenCalledWith({
            id: 1,
            name: 'Updated Name',
            category: 'Updated Category',
            price: 150,
            quantity: 5,
        });

        expect(mockDialogRef.close).toHaveBeenCalledWith({
            status: 'ok',
            message: 'Product updated successfully',
        });
    });

    it('should close the dialog with error status on update failure', () => {
        mockProductService.updateProduct.and.returnValue(
            throwError(() => new Error('Update failed')),
        );

        component.updateProductForm.setValue({
            name: 'Updated Name',
            category: 'Updated Category',
            price: 150,
            quantity: 5,
        });

        component.onSubmit();

        expect(mockDialogRef.close).toHaveBeenCalledWith({
            status: 'error',
            message: jasmine.any(Error),
        });
    });

    it('should close the dialog with cancel status on cancel', () => {
        component.onCancel();

        expect(mockDialogRef.close).toHaveBeenCalledWith({
            status: 'cancel',
            message: 'No se actualiza el producto',
        });
    });
});
