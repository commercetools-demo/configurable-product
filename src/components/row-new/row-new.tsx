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
import messages from './messages';
import { useIntl } from 'react-intl';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';

type Props = {
  onClose: () => void;
};

const RowNew: FC<Props> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
  const { projectLanguages } = useCustomViewContext((context) => ({
    projectLanguages: context.project?.languages ?? [],
  }));

  const [isOpen, setIsOpen] = useState(true);

  const showNotification = useShowNotification();
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
    const oldValue: Array<Row> = [...mapCustomObject(customObject)];
    oldValue.push(row);

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
        onClose();
        setIsOpen(false);
      },
      onError(message) {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editError, { message: message }),
        });

        refetch();
      },
    });
  };

  return (
    <RowForm
      initialValues={customObjectToConfigRow(projectLanguages)}
      onSubmit={onSubmit}
    >
      {(formProps) => {
        return (
          <>
            <CustomFormModalPage
              title={intl.formatMessage(messages.title)}
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
RowNew.displayName = 'RowNew';

export default RowNew;
