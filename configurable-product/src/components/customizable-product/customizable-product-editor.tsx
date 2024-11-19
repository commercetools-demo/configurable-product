import Text from '@commercetools-uikit/text';
import { mapCustomObject } from '../../helpers';
import messages from './messages';
import { FC } from 'react';
import { TCustomObject } from '../../types/generated/ctp';
import { InfoMainPage } from '@commercetools-frontend/application-components';
import { useIntl } from 'react-intl';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { useHistory, useRouteMatch } from 'react-router';
import { Row as ConfigRow } from '../row-form/row-form';
import createColumnDefinitions, {
  renderAttributeTypeName,
} from './column-definitions';
import BooleanIndicator from '../boolean-indicator';

type Row = ConfigRow & TRow;

export type Props = {
  resource: TCustomObject;
};
const CustomizableProductEditor: FC<Props> = ({ resource }) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();

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
    </InfoMainPage>
  );
};

export default CustomizableProductEditor;
