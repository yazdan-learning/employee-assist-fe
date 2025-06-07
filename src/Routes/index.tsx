// Product pages
import ProductList from "../pages/Accountant/Products/ProductList";
import ProductForm from "../pages/Accountant/Products/components/ProductForm";

const authProtectedRoutes = [
  // ... existing routes ...

  // Product routes
  { path: "/accountant/products", component: ProductList },
  { path: "/accountant/products/new", component: ProductForm },
  { path: "/accountant/products/:id/edit", component: ProductForm },

  // ... existing routes ...
];
