import 'src/global.css';
import 'swiper/css';
import { ThemeProvider } from './theme/theme-provider';
import { useScrollToTop } from './hooks/use-scroll-to-top';
import { Router } from './routes/sections';
import { ToastContainer } from 'react-toastify';

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <ToastContainer />
      <Router />
    </ThemeProvider>
  );
}
