import { SvgColor } from 'src/components/svg-color';

const icon = name => (
  <SvgColor
    width="100%"
    height="100%"
    src={`/assets/icons/navbar/${name}.svg`}
  />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
    permission: ['all'],
  },
  {
    title: 'Products',
    path: '/products',
    icon: icon('ic-cart'),
    permission: ['view_product', 'manager_product'],
  },
  {
    title: 'Variants',
    path: '/variants',
    icon: icon('ic-cart'),
    permission: [
      'view_variant',
      'manager_variant',
      'view_product',
      'manager_product',
    ],
  },
  {
    title: 'Tiers',
    path: '/tiers',
    icon: icon('ic-cart'),
    permission: ['view_tier', 'manager_tier'],
  },
  {
    title: 'Order List',
    path: '/orderList',
    icon: icon('ic-cart'),
    permission: ['view_order', 'manager_order'],
  },
  {
    title: 'Blogs',
    path: '/blogs',
    icon: icon('ic-blog'),
    permission: ['view_blog', 'manager_blog'],
  },
  {
    title: 'Managers',
    path: '/managers',
    icon: icon('ic-user'),
    permission: ['view_manager', 'manager_manager'],
  },
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic-user'),
    permission: ['view_user', 'manager_user'],
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: icon('ic-user'),
    permission: ['all'],
  },
];
