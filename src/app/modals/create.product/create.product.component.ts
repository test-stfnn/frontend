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

    /**
     * @method integerValidator
     * @param control - Control del formulario que contiene el valor.
     * @description Valida que el valor ingresado sea un número entero.
     * @returns Un objeto con el error si el valor no es un número entero, o null si es válido.
     */
    integerValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        return Number.isInteger(value) ? null : { integer: true };
    }

    /**
     * @method onSubmit
     * @description Envía el formulario si es válido y llama al servicio para agregar un nuevo producto.
     * Cierra el cuadro de diálogo con el estado del resultado (éxito o error).
     */
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
                error: (error: Error) => {
                    this.dialogRef.close({
                        status: 'error',
                        message: error.message,
                    });
                    console.error(error);
                },
            });
        }
    }

    /**
     * @method onCancel
     * @description Cierra el cuadro de diálogo sin realizar ninguna acción para crear un nuevo producto.
     * Retorna un estado de cancelación.
     */
    onCancel(): void {
        this.dialogRef.close({
            status: 'cancel',
            message: 'No se crea el producto',
        }); // Close the dialog without changes
    }
}
