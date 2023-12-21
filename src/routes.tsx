import type { ReactNode } from 'react';
import CustomizableProduct from './components/customizable-product';
import { Route, Switch, useRouteMatch } from 'react-router';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/custom-applications/development/permissions
   *
   * NOTE that by default the Custom View implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  const match = useRouteMatch();

  console.log(`${match.path}/page-A`);

  return (
    <Switch>
      <Route path={`${match.path}/page-A`}>
        <CustomizableProduct />
      </Route>
      <Route path={`${match.path}/page-B`}>
        <CustomizableProduct />
      </Route>
      <Route>
        <CustomizableProduct />
      </Route>
    </Switch>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
