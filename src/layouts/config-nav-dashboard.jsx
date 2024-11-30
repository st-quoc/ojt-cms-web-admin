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
  },
  {
    title: 'Products',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Variants',
    path: '/variants',
    icon: icon('ic-cart'),
  },
  {
    title: 'Blogs',
    path: '/blogs',
    icon: icon('ic-blog'),
  },
  {
    title: 'Permissons',
    path: '/permissons',
    icon: icon('ic-user'),
  },
  {
    title: 'Users',
    path: '/user',
    icon: icon('ic-user'),
  },
];
