import { HomeComponent } from '../Home/Home.HomeComponent';

export const MainRoutes = [
  {
    path: 'Customer',
    loadChildren: '../Customer/Customer.CustomerModule#CustomerModule'
  },
  {
    path: 'Supplier',
    loadChildren: '../Suppliers/Supplier.SupplierModule#SupplierModule'
  },
  { path: 'Home', component: HomeComponent },
  { path: '', component: HomeComponent }
];
