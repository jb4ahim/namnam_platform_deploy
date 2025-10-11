# App Configuration Module Documentation

## Overview
The App Configuration module allows you to manage dynamic content sections for the customer home page. You can configure carousels, grids, lists, and feeds with either manual item selection or dynamic data sources.

---

## API Endpoints

### 1. Get Home Configuration
**Endpoint:** `GET /app-config/home`

**Description:** Retrieves the current home page configuration.

**Response:**
```json
{
  "ttl_seconds": 300,
  "sections": [...]
}
```

---

### 2. Update Home Configuration
**Endpoint:** `POST /app-config/home`

**Description:** Updates the home page configuration (requires authentication).

**Headers:**
- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Request Body:** See examples below

---

## Data Structure

### Root Configuration
```typescript
{
  "ttl_seconds": number,        // Cache duration in seconds
  "sections": SectionDto[]      // Array of page sections
}
```

### Section Structure
```typescript
{
  "id": string,                 // Unique section identifier
  "component": ComponentType,   // Section component type
  "title": string,              // Optional section title
  "subtitle": string,           // Optional section subtitle
  "layout": LayoutDto,          // Layout configuration
  "data_source": DataSourceDto  // Data source configuration
}
```

---

## Enums Reference

### ComponentType
- `carousel` - Image carousel/slider
- `grid` - Grid layout
- `horizontal_list` - Horizontal scrollable list
- `vertical_feed` - Vertical scrolling feed
- `logo_strip` - Brand logo strip

### CardType
- `promotion` - Promotion card
- `merchant_compact` - Compact merchant card
- `merchant_large` - Large merchant card
- `product` - Product card

### EntityType
- `merchant` - Merchant/Restaurant
- `product` - Product/Menu item
- `promotion` - Promotion/Offer

### ActionType
- `NAVIGATE` - Navigate to app route
- `EXTERNAL_LINK` - Open external URL
- `DEEPLINK` - Open deeplink

### SortDirection
- `asc` - Ascending order
- `desc` - Descending order

---

## Configuration Examples

### 1. Manual Selection (Handpicked Items)

#### Manually Selected Promotions
```json
{
  "id": "featured_promotions",
  "component": "carousel",
  "title": "Featured Deals",
  "layout": {
    "height": 200,
    "autoScroll": true,
    "showDots": true
  },
  "data_source": {
    "entity": "promotion",
    "manual_ids": [1, 5, 8, 12]
  }
}
```

#### Manually Selected Merchants
```json
{
  "id": "editors_choice",
  "component": "grid",
  "title": "Editor's Choice Restaurants",
  "layout": {
    "columns": 2,
    "spacing": 12,
    "card": "merchant_compact"
  },
  "data_source": {
    "entity": "merchant",
    "manual_ids": [10, 25, 33, 42, 58, 67]
  }
}
```

#### Manually Selected Products
```json
{
  "id": "trending_items",
  "component": "horizontal_list",
  "title": "Trending Now",
  "layout": {
    "card": "product",
    "itemWidth": 220
  },
  "data_source": {
    "entity": "product",
    "manual_ids": [101, 205, 310, 412, 523]
  }
}
```

---

### 2. Dynamic Data Sources (Filtered & Sorted)

#### Active Promotions Carousel
```json
{
  "id": "hero_promotions",
  "component": "carousel",
  "layout": {
    "height": 180,
    "autoScroll": true,
    "showDots": true
  },
  "data_source": {
    "entity": "promotion",
    "filters": {
      "is_active": true,
      "display_location": "hero"
    },
    "sort": [
      { "field": "display_order", "dir": "asc" }
    ],
    "limit": 5
  }
}
```

#### Fastest Delivery Merchants
```json
{
  "id": "fastest_delivery",
  "component": "horizontal_list",
  "title": "Fastest delivery 🔥",
  "layout": {
    "card": "merchant_compact",
    "itemWidth": 260
  },
  "data_source": {
    "entity": "merchant",
    "filters": {
      "city": "auto",
      "is_open": true
    },
    "sort": [
      { "field": "eta_minutes", "dir": "asc" }
    ],
    "limit": 12
  }
}
```

#### Discounted Merchants
```json
{
  "id": "daily_discounts",
  "component": "horizontal_list",
  "title": "Daily Discounts",
  "subtitle": "Up to 50% OFF on selected restaurants",
  "layout": {
    "card": "promotion",
    "itemWidth": 280,
    "showMore": { "route": "/promos/daily" }
  },
  "data_source": {
    "entity": "merchant",
    "filters": {
      "has_discount": true
    },
    "sort": [
      { "field": "discount_pct", "dir": "desc" }
    ],
    "limit": 10
  }
}
```

#### Popular Products
```json
{
  "id": "popular_items",
  "component": "horizontal_list",
  "title": "Popular items",
  "layout": {
    "card": "product",
    "itemWidth": 220
  },
  "data_source": {
    "entity": "product",
    "filters": {
      "popularity_window_days": 14
    },
    "sort": [
      { "field": "popularity_score", "dir": "desc" }
    ],
    "limit": 12
  }
}
```

#### Nearby Merchants (Vertical Feed)
```json
{
  "id": "nearby_merchants",
  "component": "vertical_feed",
  "title": "Nearby Restaurants",
  "layout": {
    "card": "merchant_large"
  },
  "data_source": {
    "entity": "merchant",
    "filters": {
      "near": { "lat": "auto", "lng": "auto" },
      "radius_km": 5
    },
    "sort": [
      { "field": "featured_score", "dir": "desc" }
    ],
    "limit": 20,
    "pagination": { "cursor": null }
  }
}
```

---

### 3. Hybrid Approach (Manual + Filters)

```json
{
  "id": "curated_deals",
  "component": "horizontal_list",
  "title": "Curated for You",
  "layout": {
    "card": "promotion",
    "itemWidth": 280
  },
  "data_source": {
    "entity": "promotion",
    "manual_ids": [3, 7, 15, 22],
    "filters": {
      "is_active": true
    },
    "sort": [
      { "field": "display_order", "dir": "asc" }
    ]
  }
}
```

---

## Complete Example Request

```json
{
  "ttl_seconds": 300,
  "sections": [
    {
      "id": "hero_carousel",
      "component": "carousel",
      "layout": {
        "height": 180,
        "autoScroll": true,
        "showDots": true
      },
      "data_source": {
        "entity": "promotion",
        "manual_ids": [1, 2, 3]
      }
    },
    {
      "id": "daily_deals",
      "component": "horizontal_list",
      "title": "Daily Discounts",
      "subtitle": "Up to 50% OFF",
      "layout": {
        "card": "merchant_compact",
        "itemWidth": 280,
        "showMore": { "route": "/deals" }
      },
      "data_source": {
        "entity": "merchant",
        "filters": { "has_discount": true },
        "sort": [{ "field": "discount_pct", "dir": "desc" }],
        "limit": 10
      }
    },
    {
      "id": "nearby_feed",
      "component": "vertical_feed",
      "title": "Nearby Restaurants",
      "layout": {
        "card": "merchant_large"
      },
      "data_source": {
        "entity": "merchant",
        "filters": {
          "near": { "lat": "auto", "lng": "auto" },
          "radius_km": 5
        },
        "sort": [{ "field": "featured_score", "dir": "desc" }],
        "limit": 20
      }
    }
  ]
}
```

---

## Database Schema

### Table: `app_config`
```sql
CREATE TABLE app_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Functions & Procedures
- `select_app_config(p_key)` - Get config by key
- `upsert_app_config(p_key, p_value)` - Create or update config

---

## Best Practices

1. **Use Manual IDs for curated content** - When you want specific items in a specific order
2. **Use Dynamic Sources for real-time content** - When you want automated, filtered results
3. **Set appropriate TTL** - Cache duration based on how often content changes
4. **Limit results** - Use `limit` to control API performance
5. **Use pagination for feeds** - For vertical feeds with many items

---

## Notes

- `manual_ids` takes precedence when specified with filters
- The `auto` value in location filters uses the user's current location
- All sections are optional - mix and match as needed
- Section order in the array determines display order on the app
