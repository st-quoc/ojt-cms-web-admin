import { Helmet } from 'react-helmet-async';
import { UserView } from 'src/sections/user/view';
import { CONFIG } from '../config-global';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
