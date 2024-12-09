import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchBlogDetail from '../../hooks/apis/useFetchBlogDetail';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DashboardContent } from '../../layouts/dashboard/main';
import { AdminPageHeader } from '../../components/AdminPageHeader';

export const BlogDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error } = useFetchBlogDetail(id);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    navigate('/404');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.appName} - Blogs List`}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Blogs', path: '/blogs' },
          ]}
          buttons={[
            {
              label: 'Edit Blog',
              onClick: () => navigate(`/blogs/edit/${id}`),
              variant: 'contained',
              color: 'primary',
            },
          ]}
        />
        <Box sx={{ width: '100%', mb: 2, p: 2 }}>
          <Box
            sx={{
              minHeight: '500px',
              backgroundImage: `url(${blog?.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              textAlign: 'center',
              overflow: 'hidden',
            }}
            title={blog?.title}
          ></Box>
          <Container maxWidth="md" sx={{
            transform: "translateY(-200px)"
          }}>
            <Card sx={{ mt: 3 }}>
              <CardContent
                sx={{
                  backgroundColor: 'white',
                  borderRadius: { xs: '0 0 8px 8px', lg: '0 8px 8px 0' },
                  position: 'relative',
                  top: '-32px',
                  p: { xs: 5, sm: 10 },
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  color="textPrimary"
                  gutterBottom
                >
                  {blog?.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  {new Date(blog?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{ py: 6 }}
                  dangerouslySetInnerHTML={{ __html: blog?.fullDesc }}
                />
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardContent>
    </>
  );
};
