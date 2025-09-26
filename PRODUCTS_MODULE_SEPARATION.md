# Products Module Separation - API Reference

## Overview
The products functionality has been separated from the catalog module into its own dedicated products module. This provides better separation of concerns and cleaner API structure.

## API Changes

### Before (Combined in Catalog)
```
GET    /catalog/sections        - Get sections
POST   /catalog/sections        - Create section  
PUT    /catalog/sections/:id    - Update section
GET    /catalog/products        - Get products
POST   /catalog/products        - Create product
PUT    /catalog/products/:id    - Update product
```

### After (Separated)

#### Catalog Module (Sections Only)
```
GET    /catalog/sections        - Get sections
POST   /catalog/sections        - Create section  
PUT    /catalog/sections/:id    - Update section
```

#### Products Module (Products Only)
```
GET    /products                - Get products (with optional sectionId query param)
GET    /products/:id            - Get product by ID
POST   /products                - Create product
PUT    /products/:id            - Update product
DELETE /products/:id            - Delete product
```

## Module Structure

### Catalog Module
- **Controller**: `CatalogController`
- **Service**: `CatalogService`
- **Repository**: `CatalogRepository`
- **DTOs**: `CreateSectionDto`, `UpdateSectionDto`

### Products Module  
- **Controller**: `ProductsController`
- **Service**: `ProductsService`
- **Repository**: `ProductsRepository`
- **DTOs**: `CreateProductDto`, `UpdateProductDto`

## Additional Features in Products Module

The products module includes additional endpoints not previously available:

1. **GET /products/:id** - Retrieve a specific product by ID
2. **DELETE /products/:id** - Delete a product

## Authentication
All endpoints in both modules require authentication using the `@AuthGuard()` decorator and extract the merchant ID using the `@CurrentUserId()` decorator.

## Error Handling
Both modules include comprehensive error handling with:
- BadRequestException for failed operations
- NotFoundException for missing resources (products module)
- Detailed error logging for debugging

## Database Integration
Both modules use the DatabaseUtils helper for calling stored procedures and functions:
- **Catalog**: Uses `select_catalog_sections`, `insert_catalog_section`, `update_merchant_section`
- **Products**: Uses `select_merchant_products`, `insert_merchant_product`, `update_merchant_product`, `delete_merchant_product`, `select_merchant_product_by_id`