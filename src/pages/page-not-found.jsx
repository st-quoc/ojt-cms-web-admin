import { Helmet } from 'react-helmet-async';
import { NotFoundView } from 'src/sections/error';
import { CONFIG } from '../config-global';

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> {`404 page not found! | Error - ${CONFIG.appName}`}</title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
