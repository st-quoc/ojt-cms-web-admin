import { Suspense, useEffect, useState } from 'react';
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
import { ProfileAdmin } from '../pages/profile';
import BlogCreateAdmin from '../pages/blogs/create';
import { BlogEditAdmin } from '../pages/blogs/edit';
import { BlogDetailAdmin } from '../pages/blogs/detail';
import { CircularProgress } from '@mui/material';
import OrderList from '../pages/order/orderList';

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

const RequirePermission = ({ permissions, children }) => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.permissions) {
      setUserPermissions(userInfo.permissions);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  const hasPermission = permissions.every(permission =>
    userPermissions.includes(permission),
  );

  if (!hasPermission) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};
const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setIsAuthenticated(!!userInfo);
  }, []);

  if (isAuthenticated === null) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function Router() {
  return useRoutes([
    {
      element: (
        <RequireAuth>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </RequireAuth>
      ),
      children: [
        { element: <Dashboard />, index: true },
        
        {
          path: 'orderList',
          element: (
            <RequirePermission
              permissions={['view_product', 'manager_product']|| null}
            >
              <OrderList />
            </RequirePermission>
          ),
        },
        {
          path: 'products',
          element: (
            <RequirePermission
              permissions={['view_product', 'manager_product']}
            >
              <ProductsListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'product/create',
          element: (
            <RequirePermission
              permissions={['view_product', 'manager_product']}
            >
              <ProductCreateAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'product/detail/:id',
          element: (
            <RequirePermission
              permissions={['view_product', 'manager_product']}
            >
              <DetailProductAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'product/edit/:id',
          element: (
            <RequirePermission
              permissions={['view_product', 'manager_product']}
            >
              <ProductEditAdmin />
            </RequirePermission>
          ),
        },

        {
          path: 'variants',
          element: (
            <RequirePermission
              permissions={['view_variant', 'manager_variant']}
            >
              <VariantsPage />
            </RequirePermission>
          ),
        },

        {
          path: 'blogs',
          element: (
            <RequirePermission permissions={['view_blog', 'manager_blog']}>
              <BlogsListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'blogs/create',
          element: (
            <RequirePermission permissions={['view_blog', 'manager_blog']}>
              <BlogCreateAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'blogs/detail/:id',
          element: (
            <RequirePermission permissions={['view_blog', 'manager_blog']}>
              <BlogDetailAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'blogs/edit/:id',
          element: (
            <RequirePermission permissions={['view_blog', 'manager_blog']}>
              <BlogEditAdmin />
            </RequirePermission>
          ),
        },

        {
          path: 'managers',
          element: (
            <RequirePermission
              permissions={['view_manager', 'manager_manager']}
            >
              <ManagersListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'managers/create',
          element: (
            <RequirePermission
              permissions={['view_manager', 'manager_manager']}
            >
              <CreateManager />
            </RequirePermission>
          ),
        },
        {
          path: 'managers/detail/:id',
          element: (
            <RequirePermission
              permissions={['view_manager', 'manager_manager']}
            >
              <BlogsListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'managers/edit/:id',
          element: (
            <RequirePermission
              permissions={['view_manager', 'manager_manager']}
            >
              <EditManager />
            </RequirePermission>
          ),
        },

        {
          path: 'users',
          element: (
            <RequirePermission permissions={['view_user', 'manager_user']}>
              <UsersListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'users/create',
          element: (
            <RequirePermission permissions={['view_user', 'manager_user']}>
              <CreateUser />
            </RequirePermission>
          ),
        },
        {
          path: 'users/detail/:id',
          element: (
            <RequirePermission permissions={['view_user', 'manager_user']}>
              <BlogsListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'users/edit/:id',
          element: (
            <RequirePermission permissions={['view_user', 'manager_user']}>
              <EditUser />
            </RequirePermission>
          ),
        },

        {
          path: 'tiers',
          element: (
            <RequirePermission permissions={['view_tier', 'manager_tier']}>
              <TiersListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'tiers/create',
          element: (
            <RequirePermission permissions={['view_tier', 'manager_tier']}>
              <CreateTier />
            </RequirePermission>
          ),
        },
        {
          path: 'tiers/detail/:id',
          element: (
            <RequirePermission permissions={['view_tier', 'manager_tier']}>
              <BlogsListAdmin />
            </RequirePermission>
          ),
        },
        {
          path: 'tiers/edit/:id',
          element: (
            <RequirePermission permissions={['view_tier', 'manager_tier']}>
              <EditTier />
            </RequirePermission>
          ),
        },

        {
          path: 'promotions/list/',
          element: (
            <RequirePermission permissions={['manage_promotions']}>
              <EditTier />
            </RequirePermission>
          ),
        },
        {
          path: 'promotions/create',
          element: (
            <RequirePermission permissions={['manage_promotions']}>
              <EditTier />
            </RequirePermission>
          ),
        },
        {
          path: 'promotions/detail/:id',
          element: (
            <RequirePermission permissions={['manage_promotions']}>
              <EditTier />
            </RequirePermission>
          ),
        },
        {
          path: 'promotions/edit/:id',
          element: (
            <RequirePermission permissions={['manage_promotions']}>
              <EditTier />
            </RequirePermission>
          ),
        },

        { path: 'profile', element: <ProfileAdmin /> },
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
