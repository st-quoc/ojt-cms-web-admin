import {
  Breadcrumbs,
  Button,
  Stack,
  Box,
  Link as MuiLink,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

export const AdminPageHeader = ({ breadcrumbs = [], buttons = [] }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => (
          <MuiLink
            key={index}
            component={Link}
            to={crumb.path}
            underline={index === breadcrumbs.length - 1 ? 'none' : 'hover'}
            color={
              index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'
            }
          >
            {crumb.label}
          </MuiLink>
        ))}
      </Breadcrumbs>

      <Stack direction="row" spacing={2}>
        {buttons.map((button, index) => (
          <Button
            size="small"
            key={index}
            variant={button.variant || 'contained'}
            color={button.color || 'primary'}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};
