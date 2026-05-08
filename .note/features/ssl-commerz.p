## SSL Commerz — Implementation Summary

### Files created/modified

| File | Action |
|------|--------|
| [`src/app/api/enrollments/v1/model.ts`](src/app/api/enrollments/v1/model.ts)                         | +`tranId`, `sslValId` fields |
| [`src/app/api/payment/sslcommerz/init/route.ts`](src/app/api/payment/sslcommerz/init/route.ts)       | Creates enrollment + SSL session, returns `GatewayPageURL` |
| [`src/app/api/payment/sslcommerz/success/route.ts`](src/app/api/payment/sslcommerz/success/route.ts) | Validates with SSL API → marks enrollment `completed` |
| [`src/app/api/payment/sslcommerz/fail/route.ts`](src/app/api/payment/sslcommerz/fail/route.ts)       | Marks enrollment `failed` |
| [`src/app/api/payment/sslcommerz/cancel/route.ts`](src/app/api/payment/sslcommerz/cancel/route.ts)   | Redirects to cancel page |
| [`src/app/api/payment/sslcommerz/ipn/route.ts`](src/app/api/payment/sslcommerz/ipn/route.ts)         | IPN handler — validates + updates enrollment (backup) |
| [`src/app/payment/success/page.tsx`](src/app/payment/success/page.tsx)                               | Success UI |
| [`src/app/payment/fail/page.tsx`](src/app/payment/fail/page.tsx)                                     | Fail UI |
| [`src/app/payment/cancel/page.tsx`](src/app/payment/cancel/page.tsx)                                 | Cancel UI |
| [`src/app/purchase/page.tsx`](src/app/purchase/page.tsx)                                             | Calls init → redirects to SSL gateway |

### Add to `.env.local`

```env
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_SANDBOX=true          # set false for production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Flow

1. User fills form → clicks **Pay with SSLCommerz**
2. `/api/payment/sslcommerz/init` creates pending enrollment + calls SSL Commerz API
3. Frontend redirects to `GatewayPageURL` (SSL Commerz hosted page)
4. User pays via card/bKash/Nagad/bank
5. SSL Commerz POSTs to `/api/payment/sslcommerz/success` → validates `val_id` → marks enrollment `completed + running`
6. IPN endpoint provides backup update if browser redirect fails

Cash enrollment still works via the existing "Pay In Person" button.