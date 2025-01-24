import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductService } from '@services/product.service';
import { of, throwError } from 'rxjs';

import { CreateProductComponent } from './create.product.component';

describe('CreateProductComponent', () => {
    let component: CreateProductComponent;
    let fixture: ComponentFixture<CreateProductComponent>;
    let productService: jasmine.SpyObj<ProductService>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<CreateProductComponent>>;

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        productService = jasmine.createSpyObj<ProductService>('ProductService', ['addProduct']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: ProductService, useValue: productService },
                provideAnimations(),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form on ngOnInit', () => {
        expect(component.addProductForm).toBeDefined();
        expect(component.addProductForm.controls['name']).toBeDefined();
        expect(component.addProductForm.controls['category']).toBeDefined();
        expect(component.addProductForm.controls['price']).toBeDefined();
        expect(component.addProductForm.controls['quantity']).toBeDefined();
    });

    it('should validate the form fields correctly', () => {
        const nameControl = component.addProductForm.controls['name'];
        const categoryControl = component.addProductForm.controls['category'];
        const priceControl = component.addProductForm.controls['price'];
        const quantityControl = component.addProductForm.controls['quantity'];

        nameControl.setValue('P');
        categoryControl.setValue('Cat');
        priceControl.setValue(-10);
        quantityControl.setValue(0);

        expect(nameControl.invalid).toBeTrue();
        expect(categoryControl.valid).toBeTrue();
        expect(priceControl.invalid).toBeTrue();
        expect(quantityControl.invalid).toBeTrue();
    });

    it('should call productService.addProduct on valid form submission', () => {
        const validProduct = { name: 'Product1', category: 'Category1', price: 10, quantity: 5 };
        component.addProductForm.setValue(validProduct);

        productService.addProduct.and.returnValue(of({ product: { id: 1, ...validProduct}, message: 'Product added successfully' }));

        component.onSubmit();

        expect(productService.addProduct).toHaveBeenCalledWith(validProduct);
        expect(dialogRef.close).toHaveBeenCalledWith({
            status: 'ok',
            message: 'Product added successfully'
        });
    });

    it('should handle productService error on form submission', () => {
        const validProduct = { name: 'Product1', category: 'Category1', price: 10, quantity: 5 };
        component.addProductForm.setValue(validProduct);

        productService.addProduct.and.returnValue(throwError(() => new Error('Failed to add product')));

        component.onSubmit();

        expect(productService.addProduct).toHaveBeenCalledWith(validProduct);
        expect(dialogRef.close).toHaveBeenCalledWith({
            status: 'error',
            message: 'Failed to add product'
        });
    });

    it('should close the dialog when cancel is clicked', () => {
        component.onCancel();
        expect(dialogRef.close).toHaveBeenCalledWith({
            status: 'cancel',
            message: 'No se crea el producto',
        });
    });
    // Valid Cases
    it('should return null for valid integer values', () => {
        const validValues = [5, 0, -3];
        validValues.forEach(value => {
            const control = new FormControl(value);
            expect(component.integerValidator(control)).toBeNull();
        });
    });

    // Invalid Cases
    it('should return { integer: true } for non-integer values', () => {
        const invalidValues = [5.5, '5', 'abc', null, undefined];
        invalidValues.forEach(value => {
            const control = new FormControl(value);
            expect(component.integerValidator(control)).toEqual({ integer: true });
        });
    });
});
