import { FC } from 'react';
import {
  CustomFormDetailPage,
  CustomFormModalPage,
  FormModalPage,
  PageNotFound,
  TabHeader,
  TabularDetailPage,
} from '@commercetools-frontend/application-components';
import { Route, Switch, useParams } from 'react-router-dom';
import {
  graphQLErrorHandler,
  useCustomObjectFetcher,
  useCustomObjectUpdater,
} from 'commercetools-demo-shared-data-fetching-hooks';
import { ContentNotification } from '@commercetools-uikit/notifications';
import {
  customObjectToConfigRow,
  getErrorMessage,
  mapCustomObject,
} from '../../helpers';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import RowForm, { Row } from '../row-form/row-form';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import messages from './messages';
import { useIntl } from 'react-intl';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { useRouteMatch } from 'react-router';

type Props = {
  onClose: () => void;
};

const RowDetails: FC<Props> = ({ onClose }) => {
  const { id, keyName } = useParams<{ id: string; keyName: string }>();
  const match = useRouteMatch();

  const intl = useIntl();
  const showNotification = useShowNotification();
  const { projectLanguages } = useCustomViewContext((context) => ({
    projectLanguages: context.project?.languages ?? [],
  }));

  const customObjectUpdater = useCustomObjectUpdater();

  const { customObject, error, refetch, loading } = useCustomObjectFetcher({
    id: id,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }

  if (!customObject || !customObject.key) {
    return <PageNotFound />;
  }

  const onSubmit = async (row: Row) => {
    const oldValue = [...mapCustomObject(customObject)];
    const index = oldValue.findIndex((entry) => entry.key === keyName);
    oldValue[index] = row;

    await customObjectUpdater
      .execute({
        draft: {
          container: customObject.container,
          key: customObject.key,
          value: JSON.stringify(oldValue),
        },
      })
      .then(() => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editSuccess),
        });
      })
      .catch(graphQLErrorHandler(showNotification));
    refetch();
  };

  const handleDelete = async () => {
    const oldValue = [...mapCustomObject(customObject)];
    const index = oldValue.findIndex((entry) => entry.key === keyName);
    oldValue.splice(index, 1);

    await customObjectUpdater
      .execute({
        draft: {
          container: customObject.container,
          key: customObject.key,
          value: JSON.stringify(oldValue),
        },
      })
      .then(() => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editSuccess),
        });
      })
      .catch(graphQLErrorHandler(showNotification));
  };

  return (
    <RowForm
      initialValues={customObjectToConfigRow(
        projectLanguages,
        keyName,
        customObject
      )}
      onSubmit={onSubmit}
    >
      {(formProps) => {
        return (
          <>
            <TabularDetailPage
              title={keyName || ''}
              onPreviousPathClick={onClose}
              formControls={
                <>
                  <CustomFormDetailPage.FormSecondaryButton
                    label={FormModalPage.Intl.revert}
                    isDisabled={!formProps.isDirty}
                    onClick={formProps.handleReset}
                  />
                  <CustomFormDetailPage.FormPrimaryButton
                    isDisabled={formProps.isSubmitting || !formProps.isDirty}
                    onClick={() => {
                      formProps.submitForm();
                    }}
                    label={FormModalPage.Intl.save}
                  />
                  <CustomFormModalPage.FormDeleteButton
                    onClick={() => handleDelete()}
                  />
                </>
              }
              tabControls={
                <>
                  <TabHeader
                    to={`${match.url}`}
                    label={intl.formatMessage(messages.generalTab)}
                    exactPathMatch={true}
                  />
                  <TabHeader
                    to={`${match.url}/details`}
                    label={intl.formatMessage(messages.detailsTab)}
                  />
                </>
              }
            >
              <Switch>
                <Route path={`${match.path}`} exact={true}>
                  {formProps.tab1}
                </Route>
                <Route path={`${match.path}/details`}>{formProps.tab2}</Route>
              </Switch>
            </TabularDetailPage>
          </>
        );
      }}
    </RowForm>
  );
};
RowDetails.displayName = 'ContainerDetails';

export default RowDetails;
