import { useRetrieveCustomObject } from '../../hooks/use-product-connector/use-product-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage } from '../../helpers';
import messages from './messages';
import { FC } from 'react';
import { TCustomObject } from '../../types/generated/ctp';
import { InfoMainPage } from '@commercetools-frontend/application-components';
import { useIntl } from 'react-intl';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { Switch, useRouteMatch } from 'react-router';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';

type Row = { name: string } & TRow;

const columns = [{ key: 'name', label: 'Name' }];

export type Props = {
  productId: string;
  variantId: string;
};
const CustomizableProductEditor: FC<Props> = ({ productId, variantId }) => {
  const intl = useIntl();
  const match = useRouteMatch();

  const { product, error, loading } = useRetrieveCustomObject({
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
  const entries = resource.value as unknown as Array<Row>;

  return (
    <>
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
              href={`/custom-views/customizable-product/projects/tech-sales-good-store/page-A`}
              label={'MOEP'}
            />
          </Spacings.Inline>
        }
      >
        {entries.map((value, index) => {
          return <div key={index}>{value.name}</div>;
        })}
        <DataTable<Row>
          isCondensed
          columns={columns}
          rows={entries.map((item) => {
            return { ...item, id: item.name };
          })}
          itemRenderer={(item, column) => {
            switch (column.key) {
              case 'name':
                return item.name;
              default:
                return null;
            }
          }}
        />
      </InfoMainPage>
    </>
  );
};

export default CustomizableProductEditor;
