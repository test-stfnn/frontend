import { CommonModule } from '@angular/common';
import { Component, Inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '@models/product.model';
import { ProductService } from '@services/product.service';

@Component({
    selector: 'app-update.create',
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatDialogContent,
        MatButtonModule,
    ],
    templateUrl: './create.product.component.html',
    styleUrls: ['./create.product.component.scss'],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CreateProductComponent implements OnInit {
    addProductForm!: FormGroup;

    constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateProductComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: Product, // Inject the data here
    ) {}

    ngOnInit(): void {
        this.addProductForm = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(20),
                ],
            ],
            category: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(20),
                ],
            ],
            price: [0, [Validators.required, Validators.min(0)]],
            quantity: [
                0,
                [Validators.required, Validators.min(1), this.integerValidator],
            ],
        });
    }

    // Custom validator for integer
    integerValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        return Number.isInteger(value) ? null : { integer: true };
    }

    onSubmit(): void {
        if (this.addProductForm.valid) {
            const addProduct = this.addProductForm.value;
            console.log('Added Product:', addProduct);
            this.productService.addProduct(addProduct).subscribe({
                next: (response: { product: Product; message: string }) => {
                    this.dialogRef.close({
                        status: 'ok',
                        message: response.message,
                    });
                },
                error: (error) => {
                    this.dialogRef.close({
                        status: 'error',
                        message: error,
                    });
                    console.error(error);
                },
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close({
            status: 'cancel',
            message: 'No se crea el producto',
        }); // Close the dialog without changes
    }
}
