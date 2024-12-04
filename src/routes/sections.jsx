import { Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProductsListAdmin from '../pages/products/list';
import SignInPage from '../pages/sign-in';
import Page404 from '../pages/page-not-found';
import { ProductEditAdmin } from '../pages/products/edit';
import { DetailProductAdmin } from '../pages/products/detail';
import { ProductCreateAdmin } from '../pages/products/create';
import VariantsPage from '../pages/variants';
import { BlogsListAdmin } from '../pages/blogs/list';
import { Dashboard } from '../pages/dashboard';
import { ManagersListAdmin } from '../pages/managers/list';
import CreateManager from '../pages/managers/create';
import EditManager from '../pages/managers/edit';
import { UsersListAdmin } from '../pages/users/list';
import CreateUser from '../pages/users/create';
import EditUser from '../pages/users/edit';
import { TiersListAdmin } from '../pages/tiers/list';
import CreateTier from '../pages/tiers/create';
import EditTier from '../pages/tiers/edit';
import {  ProfileAdmin } from '../pages/profile';

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
      children: [
        { element: <Dashboard />, index: true },

        { path: 'products', element: <ProductsListAdmin /> },
        { path: 'product/create', element: <ProductCreateAdmin /> },
        { path: 'product/detail/:id', element: <DetailProductAdmin /> },
        { path: 'product/edit/:id', element: <ProductEditAdmin /> },

        { path: 'variants', element: <VariantsPage /> },

        { path: 'blogs', element: <BlogsListAdmin /> },
        { path: 'blogs/create', element: <BlogsListAdmin /> },
        { path: 'blogs/detail/:id', element: <BlogsListAdmin /> },
        { path: 'blogs/edit/:id', element: <BlogsListAdmin /> },

        { path: 'managers', element: <ManagersListAdmin /> },
        { path: 'managers/create', element: <CreateManager /> },
        { path: 'managers/detail/:id', element: <BlogsListAdmin /> },
        { path: 'managers/edit/:id', element: <EditManager /> },

        { path: 'users', element: <UsersListAdmin /> },
        { path: 'users/create', element: <CreateUser /> },
        { path: 'users/detail/:id', element: <BlogsListAdmin /> },
        { path: 'users/edit/:id', element: <EditUser /> },

        { path: 'tiers', element: <TiersListAdmin /> },
        { path: 'tiers/create', element: <CreateTier /> },
        { path: 'tiers/detail/:id', element: <BlogsListAdmin /> },
        { path: 'tiers/edit/:id', element: <EditTier /> },


        { path: 'promotions/list/', element: <EditTier /> },
        { path: 'promotions/create', element: <EditTier /> },
        { path: 'promotions/detail/:id', element: <EditTier /> },
        { path: 'promotions/edit/:id', element: <EditTier /> },

        { path: 'profile', element: <ProfileAdmin /> },
        { path: 'promotions/create', element: <EditTier /> },
        { path: 'promotions/detail/:id', element: <EditTier /> },
        { path: 'promotions/edit/:id', element: <EditTier /> },

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
