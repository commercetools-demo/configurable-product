import { FC, useState } from 'react';
import {
  CustomFormDetailPage,
  CustomFormModalPage,
  FormModalPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import { useParams } from 'react-router-dom';
import {
  useCustomObjectFetcher,
  useCustomObjectUpdater,
} from '../../hooks/use-custom-object-connector/use-custom-object-connector';
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

type Props = {
  onClose: () => void;
};

const RowDetails: FC<Props> = ({ onClose }) => {
  const { id, keyName } = useParams<{ id: string; keyName: string }>();

  const intl = useIntl();
  const showNotification = useShowNotification();
  const [isOpen, setIsOpen] = useState(true);
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

    await customObjectUpdater.execute({
      draft: {
        container: customObject.container,
        key: customObject.key,
        value: JSON.stringify(oldValue),
      },
      onCompleted() {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editSuccess),
        });
      },
      onError(message) {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editError, { message: message }),
        });
      },
    });
    refetch();
  };

  const handleDelete = async () => {
    const oldValue = [...mapCustomObject(customObject)];
    const index = oldValue.findIndex((entry) => entry.key === keyName);

    await customObjectUpdater.execute({
      draft: {
        container: customObject.container,
        key: customObject.key,
        value: JSON.stringify(oldValue.splice(index, 0)),
      },
      onCompleted() {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editSuccess),
        });
        onClose();
        setIsOpen(false);
      },
      onError(message) {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editError, { message: message }),
        });
      },
    });
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
            <CustomFormModalPage
              title={keyName || ''}
              onClose={onClose}
              isOpen={isOpen}
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
            >
              {formProps.formElements}
            </CustomFormModalPage>
          </>
        );
      }}
    </RowForm>
  );
};
RowDetails.displayName = 'ContainerDetails';

export default RowDetails;
