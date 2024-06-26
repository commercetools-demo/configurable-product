import type { ReactNode } from 'react';
import CustomizableProduct from './components/customizable-product';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import RowDetails from './components/row-details';
import { useHistory } from 'react-router';
import RowNew from './components/row-new';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();
  const { push } = useHistory();
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

  return (
    <Switch>
      <Route path={`${match.path}/new/:id`}>
        <RowNew
          nextUrl={`${match.path}/details/`}
          onClose={() => {
            push(match.url);
          }}
        />
      </Route>
      <Route path={`${match.path}/details/:id/:keyName`}>
        <RowDetails
          onClose={() => {
            push(match.url);
          }}
        />
      </Route>
      <Route>
        <CustomizableProduct />
      </Route>
    </Switch>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
