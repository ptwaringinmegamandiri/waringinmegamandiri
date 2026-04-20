import { RouteObject } from 'react-router-dom';
import HomePage from '@/pages/home/page';
import AboutPage from '@/pages/about/page';
import PortfolioPage from '@/pages/portfolio/page';
import KarirPage from '@/pages/karir/page';
import NewsPage from '@/pages/news/page';
import KontakPage from '@/pages/kontak/page';
import AdminPage from '@/pages/admin/page';
import NotFound from '@/pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/tentang-kami',
    element: <AboutPage />,
  },
  {
    path: '/portofolio',
    element: <PortfolioPage />,
  },
  {
    path: '/karir',
    element: <KarirPage />,
  },
  {
    path: '/news',
    element: <NewsPage />,
  },
  {
    path: '/kontak',
    element: <KontakPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
