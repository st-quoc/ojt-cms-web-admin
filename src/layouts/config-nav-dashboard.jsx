import { Label } from 'src/components/label';
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
    path: '/admin',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Products Management',
    path: '/admin/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Blogs Management',
    path: '/admin/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Users Management',
    path: '/admin/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Permissons Management',
    path: '/admin/user',
    icon: icon('ic-user'),
  },
];
