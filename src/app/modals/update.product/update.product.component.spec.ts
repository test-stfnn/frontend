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
            product: { id: 1, name: 'New Product', category: 'Category 1', price: 10, quantity: 5 },
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
                        name: 'Producto prueba',
                        category: 'Categoría prueba',
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
            name: 'Producto prueba',
            category: 'Categoría prueba',
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

        const categoryControl = component.updateProductForm.get('category');
        categoryControl?.setValue('');
        expect(categoryControl?.valid).toBeFalse();
        categoryControl?.setValue('New Category');
        expect(categoryControl?.valid).toBeTrue();

        const priceControl = component.updateProductForm.get('price');
        priceControl?.setValue(-10);
        expect(priceControl?.valid).toBeFalse();
        priceControl?.setValue(10);
        expect(priceControl?.valid).toBeTrue();

        const quantityControl = component.updateProductForm.get('quantity');

        quantityControl?.setValue(-2);
        expect(quantityControl?.valid).toBeFalse();

        quantityControl?.setValue(3.5);
        expect(quantityControl?.valid).toBeFalse();

        quantityControl?.setValue(4);
        expect(quantityControl?.valid).toBeTrue();
    });

    it('should call ProductService.updateProduct and close the dialog on valid form submission', () => {
        mockProductService.updateProduct.and.returnValue(
            of({
                product: { id: 1, name: 'New Product', category: 'Category 1', price: 10, quantity: 5 },
                message: 'Product updated successfully',
            }),
        );

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

describe('when MAT_DIALOG_DATA has missing properties', () => {
    let component: UpdateProductComponent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { name: 'Partial Product' },
                },
                { provide: ProductService, useValue: mockProductService },
                provideAnimations(),
            ],
        }).compileComponents();

        const fixture = TestBed.createComponent(UpdateProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initialize with provided values and defaults for missing fields', () => {
        expect(component.updateProductForm.value).toEqual({
            name: 'Partial Product',
            category: '',
            price: 0,
            quantity: 0,
        });
    });
});

describe('when MAT_DIALOG_DATA has missing name', () => {
    let component: UpdateProductComponent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { category: 'First' },
                },
                { provide: ProductService, useValue: mockProductService },
                provideAnimations(),
            ],
        }).compileComponents();

        const fixture = TestBed.createComponent(UpdateProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initialize with provided values and defaults for missing fields', () => {
        expect(component.updateProductForm.value).toEqual({
            name: '',
            category: 'First',
            price: 0,
            quantity: 0,
        });
    });
});
