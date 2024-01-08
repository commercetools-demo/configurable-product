import { TColumn } from '@commercetools-uikit/data-table';
import memoize from 'memoize-one';
import messages from './messages';
import Text from '@commercetools-uikit/text';
import { FormattedMessage } from 'react-intl';
import { RowConfig } from '../row-form/row-form';

export default memoize(
  (formatMessage): Array<TColumn> => [
    {
      key: 'key',
      label: formatMessage(messages.columnTypeKey),
      isSortable: false,
    },
    {
      key: 'type',
      label: formatMessage(messages.columnTypeType),
      isSortable: false,
    },
    {
      key: 'isRequired',
      label: <FormattedMessage {...messages.columnIsRequired} />,
      align: 'center',
      width: 'auto',
    },
  ]
);

export const renderAttributeTypeName = (config: RowConfig) => {
  if (!config) {
    return <></>;
  }
  if (!config.type) {
    return <Text.Body>No type</Text.Body>;
  }
  const message =
    messages[`attributeLabel${config.type}` as keyof typeof messages];
  if (!message) {
    return <Text.Body>{config.type}</Text.Body>;
  }
  return (
    <Text.Body>
      <FormattedMessage {...message} />
    </Text.Body>
  );
};
