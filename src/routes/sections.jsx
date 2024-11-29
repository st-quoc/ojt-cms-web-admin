import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProductsListAdmin from '../pages/admin/products/list';
import SignInPage from '../pages/sign-in';
import Page404 from '../pages/page-not-found';
import HomePage from '../pages/home';
import { ProductEditAdmin } from '../pages/admin/products/edit';
import { DetailProductAdmin } from '../pages/admin/products/detail';
import { ProductCreateAdmin } from '../pages/admin/products/create';

const renderFallback = (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flex="1 1 auto"
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: theme =>
          varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      path: 'admin',
      children: [
        { element: <HomePage />, index: true },
        { path: 'products', element: <ProductsListAdmin /> },
        { path: 'product/create', element: <ProductCreateAdmin /> },
        { path: 'product/detail/:id', element: <DetailProductAdmin /> },
        { path: 'product/edit/:id', element: <ProductEditAdmin /> },
      ],
    },
    {
      path: 'login',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
