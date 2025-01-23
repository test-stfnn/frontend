import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UpdateProductComponent } from './modals/update.product/update.product.component';

@NgModule({
    imports: [
        MatPaginatorModule,
        MatTableModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogModule,
        UpdateProductComponent,
        MatSnackBarModule,
    ],
    exports: [
        MatPaginatorModule,
        MatTableModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogModule,
        UpdateProductComponent,
        MatSnackBarModule,
    ],
})
export class AppModule {}
