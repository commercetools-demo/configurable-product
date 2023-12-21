import { useRetrieveCustomObject } from '../../hooks/use-product-connector/use-product-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage, mapCustomObject } from '../../helpers';
import messages from './messages';
import { FC, lazy } from 'react';
import { TCustomObject } from '../../types/generated/ctp';
import { InfoMainPage } from '@commercetools-frontend/application-components';
import { useIntl } from 'react-intl';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { Switch, useHistory, useRouteMatch } from 'react-router';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { Row as ConfigRow } from '../row-form/row-form';
import createColumnDefinitions, {
  renderAttributeTypeName,
} from './column-definitions';
import BooleanIndicator from '../boolean-indicator';

type Row = ConfigRow & TRow;

const RowDetails = lazy(() => import('../row-details'));
const RowNew = lazy(() => import('../row-new/row-new'));

export type Props = {
  productId: string;
  variantId: string;
};
const CustomizableProductEditor: FC<Props> = ({ productId, variantId }) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();

  const { product, error, loading, refetch } = useRetrieveCustomObject({
    id: productId,
  });
  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  if (!loading && !product) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }

  const variant = product?.masterData.current?.allVariants.find(
    (value) => value.id === Number(variantId)
  );

  if (!variant) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }

  const attribute = variant.attributesRaw.find(
    (attribute) => attribute.name === 'configuration'
  );
  if (!attribute) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }
  const referencedResource = attribute.referencedResource;
  if (!referencedResource) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }
  if (
    !('__typename' in referencedResource) ||
    referencedResource.__typename !== 'CustomObject'
  ) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }

  const resource = referencedResource as TCustomObject;

  return (
    <InfoMainPage
      title={intl.formatMessage(messages.title)}
      customTitleRow={
        <Spacings.Inline justifyContent="space-between">
          <Spacings.Inline alignItems="baseline">
            <Text.Headline as="h2" data-testid="title">
              {intl.formatMessage(messages.title)}
            </Text.Headline>
          </Spacings.Inline>

          <SecondaryButton
            iconLeft={<PlusBoldIcon />}
            as="a"
            to={`${match.url}/${resource.id}/new`}
            label={intl.formatMessage(messages.createNewRow)}
          />
        </Spacings.Inline>
      }
    >
      <DataTable<Row>
        isCondensed
        columns={createColumnDefinitions(intl.formatMessage)}
        rows={mapCustomObject(resource).map((item) => {
          return { ...item, id: item.key };
        })}
        onRowClick={(row) => {
          push(`${match.url}/${resource.id}/${row.key}`);
        }}
        itemRenderer={(item, column) => {
          switch (column.key) {
            case 'key':
              return item.key;
            case 'type':
              return renderAttributeTypeName(item.config);
            case 'isRequired':
              return (
                <BooleanIndicator isTrue={item.config?.isRequired || false} />
              );
            default:
              return null;
          }
        }}
      />
      <Switch>
        <SuspendedRoute path={`${match.path}/:id/new`}>
          <RowNew
            onClose={() => {
              refetch();
              push(`${match.url}`);
            }}
          />
        </SuspendedRoute>
        <SuspendedRoute path={`${match.path}/:id/:keyName`}>
          <RowDetails
            onClose={() => {
              refetch();
              push(`${match.url}`);
            }}
          />
        </SuspendedRoute>
      </Switch>
    </InfoMainPage>
  );
};

export default CustomizableProductEditor;
