import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { RouterLink } from 'src/routes/components';
import { logoClasses } from './classes';
import logo from '../../assets/logo.png';

// eslint-disable-next-line react/display-name
export const Logo = forwardRef(
  ({ href = '/', disableLink = false, className, sx, ...other }, ref) => {
    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={logo}
        width={60}
        height={60}
      />
    );

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          flexShrink: 0,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'inline-flex',
          verticalAlign: 'middle',
          my: 2,
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {singleLogo}
      </Box>
    );
  },
);
