

### `claude/gtm` — files
| File                                                                              | Purpose                                                |
|-----------------------------------------------------------------------------------|--------------------------------------------------------|
| [`src/app/layout.tsx`](src/app/layout.tsx)                                        | `<GoogleTagManager gtmId={gtmId} />` in `<html>`       |
| [`src/components/gtm-route-change.tsx`](src/components/gtm-route-change.tsx)      | Fires `virtual_page_view` on SPA nav                   |
| [`src/lib/gtm.ts`](src/lib/gtm.ts)                                                | `gtmAddToCart`, `gtmPurchase`, `gtmEnrollmentStart`    |

### `claude/fbp` — adds
| File                                                                                          | Purpose                                                   |
|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| [`src/components/facebook-pixel.tsx`](src/components/facebook-pixel.tsx)                      | Pixel base code via `next/script afterInteractive`        |
| [`src/components/facebook-pixel-pageview.tsx`](src/components/facebook-pixel-pageview.tsx)    | Fires `PageView` on SPA nav                               |
| [`src/lib/tracking.ts`](src/lib/tracking.ts)                                                  | Unified helpers firing both GTM + `fbq` together          |

### Add to `.env.local`

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
```

### Usage in components

```ts
import { trackPurchase, trackAddToCart } from '@/lib/tracking';

// fires GTM dataLayer + fbq simultaneously
trackAddToCart(1200);
trackPurchase('TXN-abc123', 1200);
```