import { CommonModule } from '@angular/common';
import { Component, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { PaginatedProducts } from '@models/paginate.product.model';
import { Product } from '@models/product.model';
import { ProductService } from '@services/product.service';

@Component({
    selector: 'app-delete.product',
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
    templateUrl: './delete.product.component.html',
    styleUrl: './delete.product.component.scss',
    schemas: [NO_ERRORS_SCHEMA],
})
export class DeleteProductComponent {
    constructor(
    private productService: ProductService,
    public dialogRef: MatDialogRef<DeleteProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    ) {}

    /**
     * @method onDelete
     * @param event - Evento que se activa al intentar eliminar un producto.
     * @description Maneja la eliminación de un producto. Llama al servicio para eliminar el producto
     * por su ID y cierra el cuadro de diálogo con el estado del resultado (éxito o error).
     */
    onDelete(event: Event): void {
        event.preventDefault();

        this.productService.deleteProduct(this.data.id).subscribe({
            next: (response: Pick<PaginatedProducts, 'message'>) => {
                console.log(response);
                this.dialogRef.close({
                    status: 'ok',
                    message: response,
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

    /**
     * @method onCancel
     * @param event - Evento que se activa al cancelar la eliminación del producto.
     * @description Cierra el cuadro de diálogo sin realizar ninguna acción de eliminación.
     * Retorna un estado de cancelación.
     */
    onCancel(event: Event): void {
        event.preventDefault();
        this.dialogRef.close({
            status: 'cancel',
            message: 'No se elimina el producto',
        }); // Close the dialog without changes
    }
}
