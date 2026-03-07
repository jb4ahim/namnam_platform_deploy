# NamNam Platform - Claude Instructions

## Project Structure

This is a NestJS monorepo with three apps:
- `apps/customer_api` — port 3002, Swagger at `/api/docs`
- `apps/merchant_api` — port 3001, Swagger at `/api/docs`
- `apps/management_api` — port 3003, Swagger at `/api/docs`

## Swagger & API Documentation Rules

**Always** add Swagger/OpenAPI documentation when:
- Creating or modifying a controller endpoint — add `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth` (if auth-protected)
- Creating or modifying a DTO — add `@ApiProperty` or `@ApiPropertyOptional` on every field
- Creating a new controller — add `@ApiTags('tag-name')` at the class level

### Required decorators per context:

**Controllers:**
```ts
@ApiTags('resource-name')
@ApiBearerAuth()        // if JWT-protected
@Controller('route')
```

**Endpoints:**
```ts
@ApiOperation({ summary: 'Short description' })
@ApiResponse({ status: 200, description: 'Success', type: ResponseDto })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })  // if auth-protected
```

**DTOs:**
```ts
@ApiProperty({ example: 'value', description: 'What this field is' })
field: string;

@ApiPropertyOptional({ example: 'value' })
optionalField?: string;
```

Import from `@nestjs/swagger`.
