import {
  useProductUpdater,
  useRetrieveCustomObjectForProduct,
} from '../../hooks/use-product-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage, mapCustomObject } from '../../helpers';
import messages from './messages';
import { FC } from 'react';
import { TCustomObject } from '../../types/generated/ctp';
import { InfoMainPage } from '@commercetools-frontend/application-components';
import { FormattedMessage, useIntl } from 'react-intl';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { useHistory, useRouteMatch } from 'react-router';
import { Row as ConfigRow } from '../row-form/row-form';
import createColumnDefinitions, {
  renderAttributeTypeName,
} from './column-definitions';
import BooleanIndicator from '../boolean-indicator';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useCustomObjectUpdater } from '../../hooks/use-custom-object-connector/use-custom-object-connector';

type Row = ConfigRow & TRow;

export type Props = {
  productId: string;
  variantId: string;
};
const configuration = 'configuration';
const SUPPORTED_PRODUCT_TYPE = 'configurable';
const CustomizableProductEditor: FC<Props> = ({ productId, variantId }) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const showNotification = useShowNotification();
  const customObjectUpdater = useCustomObjectUpdater();
  const productUpdater = useProductUpdater();

  const { product, error, loading, refetch } =
    useRetrieveCustomObjectForProduct({
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
        <Text.Body>
          <FormattedMessage
            {...messages.noProduct}
            values={{ id: productId }}
          />
        </Text.Body>
      </ContentNotification>
    );
  }
  if (product?.productType?.key !== SUPPORTED_PRODUCT_TYPE) {
    return (
      <ContentNotification type="info">
        <Text.Body>
          <FormattedMessage
            {...messages.wrongProductType}
            values={{ productType: SUPPORTED_PRODUCT_TYPE }}
          />
        </Text.Body>
      </ContentNotification>
    );
  }
  const variant = product?.masterData.staged?.allVariants.find(
    (value) => value.id === Number(variantId)
  );

  if (!variant) {
    return (
      <ContentNotification type="info">
        <Text.Body>
          <FormattedMessage
            {...messages.noVariant}
            values={{ id: productId, variantId: variantId }}
          />
        </Text.Body>
      </ContentNotification>
    );
  }

  let customObjectKey = '';
  if (product.key && variant.key) {
    customObjectKey = product.key + '-' + variant.key;
  } else if (product.key && variant.sku) {
    customObjectKey = product.key + '-' + variant.sku;
  } else {
    customObjectKey = product.id + '-' + variant.sku;
  }
  const onSubmit = async () => {
    const result = await customObjectUpdater.execute({
      draft: {
        container: 'configurable-product',
        key: customObjectKey,
        value: JSON.stringify({}),
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

        refetch();
      },
    });
    await productUpdater.execute({
      actions: [
        {
          setAttribute: {
            name: configuration,
            variantId: Number.parseInt(variantId),
            value: JSON.stringify({
              id: result.data?.createOrUpdateCustomObject?.id,
              typeId: 'key-value-document',
            }),
          },
        },
      ],
      version: product.version,
      id: product.id,
    });
    refetch();
  };

  const attribute = variant.attributesRaw.find(
    (attribute) => attribute.name === configuration
  );
  if (!attribute) {
    return (
      <Spacings.Stack alignItems={'flexStart'}>
        <ContentNotification type="info">
          <Text.Body>
            <FormattedMessage
              {...messages.missingAttribute}
              values={{ attributeName: configuration }}
            />
          </Text.Body>
        </ContentNotification>
        <PrimaryButton
          label={intl.formatMessage(messages.createAndLink, {
            attributeName: configuration,
          })}
          onClick={onSubmit}
        />
      </Spacings.Stack>
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
            to={`${match.url}/new/${resource.id}`}
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
          push(`${match.url}/details/${resource.id}/${row.key}`);
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
      {/*<Switch>*/}
      {/*  <SuspendedRoute path={`${match.path}/:id/new`}>*/}
      {/*    <RowNew*/}
      {/*      onClose={() => {*/}
      {/*        refetch();*/}
      {/*        push(`${match.url}`);*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </SuspendedRoute>*/}
      {/*  <SuspendedRoute path={`${match.path}/:id/:keyName`}>*/}
      {/*    <RowDetails*/}
      {/*      onClose={() => {*/}
      {/*        refetch();*/}
      {/*        push(`${match.url}`);*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </SuspendedRoute>*/}
      {/*</Switch>*/}
    </InfoMainPage>
  );
};

export default CustomizableProductEditor;
