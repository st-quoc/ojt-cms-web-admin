import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from '../../layouts/dashboard/main';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { Permissions } from './Permissions';
import { ProfileTab } from './Profile';

export const ProfileAdmin = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.appName} - Profile`}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[{ label: 'Admin', path: '/' }, { label: 'Profile' }]}
        />
        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleChangeTab}>
              <Tab label="Profile" value={0} />
              <Tab label="Permissions" value={1} />
            </Tabs>
          </Box>
          {currentTab === 0 && <ProfileTab />}
          {currentTab === 1 && <Permissions />}
        </Paper>
      </DashboardContent>
    </>
  );
};
