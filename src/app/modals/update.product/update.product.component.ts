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
    selector: 'app-update.product',
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
    templateUrl: './update.product.component.html',
    styleUrls: ['./update.product.component.scss', '../../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'],
    schemas: [NO_ERRORS_SCHEMA],
})
export class UpdateProductComponent implements OnInit {
    updateProductForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<UpdateProductComponent>,
        private productService: ProductService,
        @Inject(MAT_DIALOG_DATA) public data: Product, // Inyección de los datos iniciales
    ) {}

    ngOnInit(): void {
        this.updateProductForm = this.fb.group({
            name: [
                this.data?.name || '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(20),
                ],
            ],
            category: [
                this.data?.category || '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(20),
                ],
            ],
            price: [this.data?.price || 0, [Validators.required, Validators.min(0)]],
            quantity: [
                this.data?.quantity || 0,
                [Validators.required, Validators.min(1), this.integerValidator],
            ],
        });
    }

    /**
     * @method integerValidator
     * @param control - Control del formulario que contiene el valor.
     * @description Valida que el valor ingresado sea un número entero.
     * @returns Un objeto con el error si el valor no es entero, o null si es válido.
     */
    integerValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        return Number.isInteger(value) ? null : { integer: true };
    }

    /**
     * @method onSubmit
     * @description Envía el formulario si es válido y realiza la actualización del producto mediante el servicio.
     * Cierra el cuadro de diálogo con un estado de éxito o error dependiendo del resultado.
     */
    onSubmit(): void {
        if (this.updateProductForm.valid) {
            const updatedProduct = this.updateProductForm.value;
            this.productService
                .updateProduct({ id: this.data.id, ...updatedProduct })
                .subscribe({
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

    /**
     * @method onCancel
     * @description Cierra el cuadro de diálogo sin realizar ningún cambio en el producto.
     * Retorna un estado de cancelación.
     */
    onCancel(): void {
        this.dialogRef.close({
            status: 'cancel',
            message: 'No se actualiza el producto',
        });
    }
}
