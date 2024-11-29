import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import List from '@mui/material/List';
import { useLocation, useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <InboxIcon />,
      path: 'dashboard',
      permission: 'VIEW_DASHBOARD',
    },
    {
      text: 'Product',
      icon: <MailIcon />,
      path: 'products',
      permission: 'view_product',
    },
    {
      text: 'Blogs',
      icon: <InboxIcon />,
      path: 'blogs',
      permission: 'view_blog',
    },
    {
      text: 'Variants',
      icon: <InboxIcon />,
      path: 'variants',
      permission: 'view_variants',
    },
    {
      text: 'Users',
      icon: <MailIcon />,
      path: 'users',
      permission: 'VIEW_USERS',
    },
  ];
  return (
    <List>
      {menuItems.map((item, index) => (
        <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => navigate(item.path)}
            sx={[
              {
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
                background:
                  location.pathname === `/admin/${item.path}`
                    ? '#1976d2'
                    : '#fff',
              },
            ]}
          >
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  justifyContent: 'center',
                  mr: open ? 3 : 'auto',
                },
              ]}
            >
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={[{ opacity: open ? 1 : 0 }]}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
