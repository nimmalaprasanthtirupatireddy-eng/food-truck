# El Fuego Truck Website Review & Rating

This report provides a detailed critique, rating, and upgrade plan for the [El Fuego Truck](https://food-truck-eta.vercel.app/) web application. The analysis is based on visual exploration via browser automation and a thorough review of the frontend and backend codebase.

---

## 📊 Summary Ratings (Scale: 1–10)

| Category | Score | Summary |
| :--- | :---: | :--- |
| **Visual Design & Aesthetics** | **8.5 / 10** | Neo-Brutalist design is incredibly bold, modern, and fits the "street food truck" theme perfectly. Outstanding typography and color contrast. |
| **Usability & UX** | **7.5 / 10** | Cart operations are seamless, search and filtering are fast, but responsive layout bugs on smaller viewports severely hinder usability. |
| **Functional Features** | **7.5 / 10** | Fully working menu, live search, item increments, checkout flow, tracking code verification, and a staff portal dashboard. |
| **Code Architecture** | **6.5 / 10** | Clean division between frontend (Vite + React) and backend (FastAPI + SQLAlchemy). However, hardcoded local urls and incorrect CORS parameters exist. |
| **Security & Privacy** | **3.0 / 10** | Critical vulnerability: Admin dashboard stats and customer order endpoints are completely unprotected at the backend API level. |
| **Overall Rating** | **6.6 / 10** | **Good Potential.** A visually outstanding, functional project that is currently held back by critical security gaps and minor frontend bugs. |

---

## 🌟 Strengths & Highlights

1. **Theme-Appropriate Styling**: The Neo-Brutalist aesthetic—characterized by thick borders (`border-4 border-black`), solid drop-shadow offsets (`shadow-[8px_8px_0px_black]`), high contrast black/red/white colors, and bold, capitalized typography—gives the brand a memorable identity.
2. **Interactive Cart State**: Adding items to the order doesn't open a disruptive page or modal; instead, it changes the item card's add-button dynamically into a `- [quantity] +` toggle.
3. **Real-time Search**: Search operates natively on the items array in React, making search filters incredibly fast.
4. **Order Tracking**: The `/track` route allows users to fetch itemized checkout orders easily using an 8-character unique order code.

---

## ⚠️ Critical Vulnerabilities & Code Issues

### 1. Hardcoded Local Backend URLs (Broken Production Images)
The frontend uses `/menu/upload-image` to upload images, but in multiple UI components, the base URL for uploaded image files is hardcoded to local development:
* [FeaturedItems.jsx:L24](file:///c:/Users/nimma/food-truck/frontend/src/components/FeaturedItems.jsx#L24)
* [MenuSection.jsx:L27](file:///c:/Users/nimma/food-truck/frontend/src/components/MenuSection.jsx#L27)
* [AdminDashboard.jsx:L297](file:///c:/Users/nimma/food-truck/frontend/src/pages/AdminDashboard.jsx#L297) & [AdminDashboard.jsx:L405](file:///c:/Users/nimma/food-truck/frontend/src/pages/AdminDashboard.jsx#L405)

**Code snippet:**
```javascript
const getImageUrl = (imageUrl) => {
  if (imageUrl?.startsWith("/uploads")) {
    return `http://127.0.0.1:8000${imageUrl}`; // ❌ Will fail in production
  }
  return imageUrl;
};
```

### 2. Missing Authentication on Sensitive Backend Endpoints
While the frontend guards routes using local storage tokens, the backend FastAPI router lacks dependency injection for checking tokens on admin endpoints:
* [admin.py:L34](file:///c:/Users/nimma/food-truck/backend/app/routes/admin.py#L34) (`@router.get("/stats")`)
* [orders.py:L77](file:///c:/Users/nimma/food-truck/backend/app/routes/orders.py#L77) (`@router.get("/")` - returns all orders containing name, phone, items)

Anyone can access customer phone numbers and dashboard stats simply by making GET requests directly to the API endpoints without providing an authentication token.

### 3. Invalid CORS Middleware Options (Browser Errors)
In [main.py:L18-24](file:///c:/Users/nimma/food-truck/backend/app/main.py#L18-L24):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, # ❌ Forbidden in browsers when origin is wildcard "*"
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Setting `allow_credentials=True` along with `allow_origins=["*"]` causes modern browsers to block the request.

### 4. Accessibility / Viewport Heights in Modals
On smaller screens or landscape phone viewports (height < 750px), the Checkout modal and the Staff Login container overflow the screen. Because `overflow-y-auto` is missing on some wrappers, buttons (like **Confirm Order** or **Sign In**) are pushed off-screen and cannot be clicked without zooming out.

---

## 🛠️ Actionable Upgrade Plan

### Phase 1: High Priority (Bugs & Security)

#### A. Protect Backend Endpoints
Implement token verification middleware or dependency injection in FastAPI.
```python
# Create a dependency helper in auth.py
from fastapi import Header

def verify_admin_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    # Verify token logic here...
```
Apply `Depends(verify_admin_token)` to `@router.get("/stats")` and `@router.get("/")`.

#### B. Dynamic URL Resolution for Images
Instead of hardcoding `127.0.0.1:8000`, resolve URLs dynamically from the configured Axios instance:
```javascript
import api from "../services/api";

const getImageUrl = (imageUrl) => {
  if (imageUrl?.startsWith("/uploads")) {
    return `${api.defaults.baseURL}${imageUrl}`;
  }
  return imageUrl;
};
```

#### C. Correct CORS Middleware
In [main.py](file:///c:/Users/nimma/food-truck/backend/app/main.py):
* If credentials (cookies) are not used, set `allow_credentials=False`.
* Alternatively, supply exact trusted domains (e.g. `allow_origins=["https://food-truck-eta.vercel.app", "http://localhost:5173"]`).

#### D. Fix Modal Scrollability
In [CheckoutModal.jsx:L67](file:///c:/Users/nimma/food-truck/frontend/src/components/CheckoutModal.jsx#L67), add max-height and scrolling styles:
```diff
- <div className="bg-white w-full max-w-xl border-4 border-black shadow-[8px_8px_0px_black] p-8">
+ <div className="bg-white w-full max-w-xl border-4 border-black shadow-[8px_8px_0px_black] p-8 max-h-[90vh] overflow-y-auto">
```
Do the same for `OrderDetailsModal` inside `AdminDashboard.jsx`.

---

### Phase 2: Medium Priority (UX & SEO Upgrades)

* **Customize HTML Title Tag**: In [index.html](file:///c:/Users/nimma/food-truck/frontend/index.html), change `<title>frontend</title>` to `<title>El Fuego Truck | Fire Tacos & Dosa</title>`.
* **Add Live Order Status Updates**: Implement polling or a WebSockets endpoint for `/track` so that users don't have to manually click "Track" multiple times to see if status changes from "Pending" to "Preparing" or "Ready".
* **Persistent Admin Session**: Use JWT or a session check endpoint so the user doesn't get disconnected unexpectedly or has their credentials verified cleanly on page refresh.
