import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginatedProducts } from '@models/paginate.product.model';
import { Product } from '@models/product.model';
import { ProductService } from '@services/product.service';

import { AppModule } from './app.module';
import { CreateProductComponent } from './modals/create.product/create.product.component';
import { DeleteProductComponent } from './modals/delete.product/delete.product.component';
import { UpdateProductComponent } from './modals/update.product/update.product.component';

interface QueryPaginationObject {
    limit: number,
    page : number,
    total: number,
};

@Component({
    selector   : 'app-root',
    standalone : true,
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    imports    : [
        MatProgressSpinnerModule,
        CommonModule,
        MatProgressSpinnerModule,
        AppModule,
        MatIconModule,
        MatFormFieldModule,
        MatDialogModule,
    ],
})
export class AppComponent implements OnInit {
    isLoading    = true;
    errorMessage = '';
    products: Product[]   = [];
    isDown       = false;
    startX       = 0;
    scrollLeft   = 0;

    queryPaginationProduct: QueryPaginationObject = {
        limit: 10,
        page : 1,
        total: 10,
    };

    displayedColumnsProductList: string[] = [
        'delete',
        'update',
        'name',
        'category',
        'price',
        'quantity',
    ];

    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    constructor(
        private productService: ProductService,
        public  dialog        : MatDialog,
        public  snackBar      : MatSnackBar,
    ) {}

    ngOnInit() {
        this.getProducts();
    }

    /**
     * @method onMouseDown
     * @param event
     * @description Función que permite interactuar con la tabla de Subusuarios al dar click.
     */
    onMouseDown(event: MouseEvent) {
        this.isDown = true;
        this.scrollContainer.nativeElement.classList.add('active');
        this.startX     = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
        this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
    }

    /**
     * @method onMouseLeave
     * @param event
     * @description Función que permite interactuar con la tabla de Subusuarios al dar click.
     */
    onMouseLeave() {
        this.isDown = false;
        this.scrollContainer.nativeElement.classList.remove('active');
    }

    /**
     * @method onMouseUp
     * @param event
     * @description Función que permite interactuar con la tabla de Subusuarios al dar click.
     */
    onMouseUp() {
        this.isDown = false;
        this.scrollContainer.nativeElement.classList.remove('active');
    }

    /**
     * @method onMouseMove
     * @param event
     * @description Función que permite interactuar con la tabla de Subusuarios al dar click.
     */
    onMouseMove(event: MouseEvent) {
        if (!this.isDown) return;
        event.preventDefault();
        const x = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
    }

    /**
     * @method getProducts
     * @description Obtiene la lista de productos desde el servicio y actualiza la vista.
     */
    getProducts() {
        this.isLoading = true;
        this.productService
            .getProducts(
                this.queryPaginationProduct?.page,
                this.queryPaginationProduct?.limit,
            )
            .subscribe({
                next: (response: PaginatedProducts) => {
                    this.products               = response.products;
                    this.isLoading              = false;
                    this.queryPaginationProduct = {
                        limit: response.limit,
                        page : response.page,
                        total: response.total,
                    };

                    this.snackBar.open(response.message, 'Cerrar', {
                        duration          : 5000,
                        horizontalPosition: 'right',
                        verticalPosition  : 'bottom',
                    });
                    console.log('snackBar.open called with:', response.message);
                },
                error: (error) => {
                    this.errorMessage = 'Failed to load data';
                    this.isLoading    = false;
                    console.error(error);
                },
            });
    }

    /**
     * @method onPageChange
     * @param event - Evento de paginación.
     * @description Función que detecta el evento de la paginación.
     */
    onPageChange(event: PageEvent): void {
        this.queryPaginationProduct.page  = event.pageIndex + 1;
        this.queryPaginationProduct.limit = event.pageSize;

        this.getProducts();
    }

    /**
     * @method trackByFn
     * @param index - Índice del elemento.
     * @param item - Elemento del producto.
     * @description Función de rastreo para identificar elementos únicos en una lista.
     */
    trackByFn(index: number, item: Product) {
        return item.id;
    }

    /**
     * @method onUpdate
     * @param item - Producto a actualizar.
     * @description Abre un cuadro de diálogo para actualizar un producto existente.
     */
    onUpdate(item: Product) {
        const dialogRef = this.dialog.open(UpdateProductComponent, {
            width       : '800px',
            disableClose: true,
            hasBackdrop : true,
            data        : item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.status === 'ok') {
                this.getProducts();
            }

            this.snackBar.open(result.message, 'Cerrar', {
                duration          : 5000,
                horizontalPosition: 'right',
                verticalPosition  : 'bottom',
            });
        });
    }

    /**
     * @method onDelete
     * @param item - Producto a eliminar.
     * @description Abre un cuadro de diálogo para eliminar un producto existente.
     */
    onDelete(item: Product) {
        const dialogRef = this.dialog.open(DeleteProductComponent, {
            width       : '800px',
            disableClose: true,
            hasBackdrop : true,
            data        : item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.status === 'ok') {
                this.getProducts();
            }

            this.snackBar.open(result.message, 'Cerrar', {
                duration          : 5000,
                horizontalPosition: 'right',
                verticalPosition  : 'bottom',
            });
        });
    }

    /**
     * @method onCreate
     * @description Abre un cuadro de diálogo para crear un nuevo producto.
     */
    onCreate() {
        const dialogRef = this.dialog.open(CreateProductComponent, {
            width       : '800px',
            disableClose: true,
            hasBackdrop : true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.status === 'ok') {
                this.getProducts();
            }

            this.snackBar.open(result.message, 'Cerrar', {
                duration          : 5000,
                horizontalPosition: 'right',
                verticalPosition  : 'bottom',
            });
        });
    }
}
