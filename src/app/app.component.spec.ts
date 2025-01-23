import { provideHttpClient, withFetch } from '@angular/common/http';
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PaginatedProducts } from '@models/paginate.product.model';
import { Product } from '@models/product.model';
import { ProductService } from '@services/product.service';
import { of, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { CreateProductComponent } from './modals/create.product/create.product.component';
import { DeleteProductComponent } from './modals/delete.product/delete.product.component';
import { UpdateProductComponent } from './modals/update.product/update.product.component';

class MatSnackBarStub {
    open() {
        return {
            onAction: () => of({}),
        };
    }
}

class MatDialogStub {
    open() {
        return {
            afterClosed: () =>
                of({ status: 'ok', message: 'Product deleted successfully' }),
        };
    }

    push() {}
}

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let productService: jasmine.SpyObj<ProductService>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let snackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        const productServiceSpy = jasmine.createSpyObj('ProductService', [
            'getProducts',
            'deleteProduct',
        ]);
        const matDialogSpy = jasmine.createSpyObj({
            open: jasmine.createSpyObj({
                afterClosed: of('your result'),
            }),
        });

        dialog = matDialogSpy;

        await TestBed.configureTestingModule({
            imports: [
                AppComponent, // Import the standalone component
                MatPaginatorModule,
                MatTableModule,
                MatToolbarModule,
                MatButtonModule,
                MatDialogModule,
                MatSnackBarModule,
            ],
            providers: [
                { provide: ProductService, useValue: productServiceSpy },
                { provide: MatDialog, useValue: MatDialogStub },
                { provide: MatSnackBar, useValue: MatSnackBarStub }, // Provide MatSnackBar
                provideHttpClient(withFetch()),
                provideAnimations(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(
            ProductService,
        ) as jasmine.SpyObj<ProductService>;
        snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should call getProducts on ngOnInit and open snackBar with success message', () => {
        const mockResponse: PaginatedProducts = {
            products: [],
            limit: 10,
            page: 1,
            total: 0,
            message: 'Products loaded successfully',
        };
        productService.getProducts.and.returnValue(of(mockResponse));

        spyOn(component.snackBar, 'open').and.callThrough();

        // Trigger ngOnInit
        fixture.detectChanges();

        // Verify getProducts was called
        expect(productService.getProducts).toHaveBeenCalledWith(1, 10);

        // Verify isLoading is false
        expect(component.isLoading).toBeFalse();

        // Verify products are updated
        expect(component.products).toEqual(mockResponse.products);

        // Verify snackBar.open was called with the correct arguments
        expect(component.snackBar.open).toHaveBeenCalledWith(
            mockResponse.message,
            'Cerrar',
            {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
            },
        );
    });

    it('should handle error when getProducts fails', () => {
        productService.getProducts.and.returnValue(
            throwError('Error loading products'),
        );

        component.ngOnInit();

        expect(productService.getProducts).toHaveBeenCalledWith(1, 10);
        expect(component.isLoading).toBeFalse();
        expect(component.errorMessage).toBe('Failed to load data');
    });

    it('should update pagination parameters and call getProducts on onPageChange', () => {
        const mockEvent = { pageIndex: 1, pageSize: 20 };
        const mockResponse: PaginatedProducts = {
            products: [],
            limit: 20,
            page: 2,
            total: 0,
            message: 'Products loaded successfully',
        };
        productService.getProducts.and.returnValue(of(mockResponse));

        component.onPageChange(mockEvent);

        expect(component.queryPaginationProduct.page).toBe(2);
        expect(component.queryPaginationProduct.limit).toBe(20);
        expect(productService.getProducts).toHaveBeenCalledWith(2, 20);
    });

    it('should open UpdateProductComponent dialog on onUpdate', () => {
        const mockProduct: Product = {
            id: 1,
            name: 'Product 1',
            category: 'Category 1',
            price: 100,
            quantity: 10,
        };
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(
            of({ status: 'ok', message: 'Product updated successfully' }),
        );
        dialog.open.and.returnValue(dialogRefSpy);

        component.onUpdate(mockProduct);

        expect(dialog.open).toHaveBeenCalledWith(UpdateProductComponent, {
            width: '800px',
            disableClose: true,
            hasBackdrop: true,
            data: mockProduct,
        });
        expect(productService.getProducts).toHaveBeenCalled();
        expect(snackBar.open).toHaveBeenCalledWith(
            'Product updated successfully',
            'Cerrar',
            {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
            },
        );
    });

    it('should open DeleteProductComponent dialog on onDelete and handle the result correctly', fakeAsync(() => {
        const mockProduct: Product = {
            id: 1,
            name: 'Product 1',
            category: 'Category 1',
            price: 100,
            quantity: 10,
        };

        spyOn(component.dialog, 'open').and.callThrough();

        // Call the method
        component.onDelete(mockProduct);
        flush();

        // Verify dialog.open is called with correct arguments
        expect(dialog.open).toHaveBeenCalledWith(DeleteProductComponent, {
            width: '800px',
            disableClose: true,
            hasBackdrop: true,
            data: mockProduct,
        });

        // Verify service and snackBar calls after dialog close
        expect(productService.getProducts).toHaveBeenCalled();
        expect(component.snackBar.open).toHaveBeenCalledWith(
            'Product deleted successfully',
            'Cerrar',
            {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
            },
        );
    }));

    it('should open CreateProductComponent dialog on onCreate', () => {
        spyOn(component.dialog, 'open').and.callThrough();
        const dialogRefSpy = jasmine.createSpyObj('MatDialog', ['open']);
        console.log(dialogRefSpy);
        dialogRefSpy.afterClosed.and.returnValue(
            of({ status: 'ok', message: 'Product deleted successfully' }),
        );
        dialog.open.and.returnValue(dialogRefSpy);

        // Trigger onCreate and simulate dialog closure
        component.onCreate();

        // Ensure the dialog was opened with the correct parameters
        expect(dialog.open).toHaveBeenCalledWith(CreateProductComponent, {
            width: '800px',
            disableClose: true,
            hasBackdrop: true,
        });

        // Ensure getProducts was called after dialog closed
        expect(productService.getProducts).toHaveBeenCalled();

        // Ensure snackBar was opened with the correct message
        expect(snackBar.open).toHaveBeenCalledWith(
            'Product created successfully',
            'Cerrar',
            {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
            },
        );
    });

    it('should handle mouse events correctly', () => {
        const mockEvent = {
            pageX: 100,
            preventDefault: jasmine.createSpy(),
        } as unknown as MouseEvent;
        component.scrollContainer = {
            nativeElement: {
                offsetLeft: 50,
                scrollLeft: 0,
                classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() },
            },
        };

        component.onMouseDown(mockEvent);
        expect(component.isDown).toBeTrue();
        expect(component.startX).toBe(50);
        expect(component.scrollLeft).toBe(0);

        component.onMouseMove(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(component.scrollContainer.nativeElement.scrollLeft).toBe(-100);

        component.onMouseUp();
        expect(component.isDown).toBeFalse();

        component.onMouseLeave();
        expect(component.isDown).toBeFalse();
    });
});
