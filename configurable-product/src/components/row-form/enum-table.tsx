import Constraints from '@commercetools-uikit/constraints';
import Spacings from '@commercetools-uikit/spacings';
import { Row } from './row-form';
import { useFormik } from 'formik';
import { FC, Fragment } from 'react';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import messages from './messages';
import { useIntl } from 'react-intl';
import memoize from 'memoize-one';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { TMergedContext } from '@commercetools-frontend/application-shell-connectors/dist/declarations/src/components/custom-view-context/custom-view-context';
import TextInput from '@commercetools-uikit/text-input';
import IconButton from '@commercetools-uikit/icon-button';
import { createColumnDefinitions } from './utils';

type Formik = ReturnType<typeof useFormik>;

type LocalizedString = { [key: string]: string };

export type Item = {
  key?: string;
  label?: LocalizedString | string;
  absoluteIndex?: number;
};

type Props = {
  onAddEnumValue: (item: Item) => void;
  onRemoveEnumValue: (absoluteIndex: number) => void;
  onChangeEnumValue: ({
    field,
    nextValue,
    absoluteIndex,
  }: {
    field: string;
    nextValue: string;
    absoluteIndex: number;
  }) => void;
  formik: {
    errors: Formik['errors'];
    touched: Formik['touched'];
    setFieldValue: Formik['setFieldValue'];
    setFieldTouched: Formik['setFieldTouched'];
    setTouched: Formik['setTouched'];
    values: Row;
    handleChange: Formik['handleChange'];
  };
};

const getLocalizedEnumLabel = (
  docLabel: LocalizedString,
  formColumnKey: string
) => {
  if (!docLabel) {
    return '';
  }
  return docLabel[formColumnKey.split('_')[1]];
};
const formToDocLocalizedEnumLabel = (formColumnKey: string) =>
  formColumnKey.replace('_', '.');

const getLangsFromEnums = (enums: Array<Item>): Array<string> => {
  let map = enums
    .map((item) => {
      return item.label ? Object.keys(item.label) : [];
    })
    .flat();
  return Array.from(new Set(map));
};

export function sortEnumLanguagesByResourceLanguages(
  enumLanguages: Array<string>,
  resourceLanguages: Array<string>
) {
  return [
    ...resourceLanguages,
    ...enumLanguages?.filter((item) => !resourceLanguages.includes(item)),
  ];
}

const getEnumLanguages = memoize((values) => (languages: Array<string>) => {
  if (!values) {
    return languages;
  }
  return values?.length > 0
    ? sortEnumLanguagesByResourceLanguages(getLangsFromEnums(values), languages)
    : languages;
});
/**
 * creates a shape like { key: '', label_de: '', label_en: '' }
 */
const createEmptyLocalizedEnum = (enumLanguages: Array<string>): Item => ({
  key: '',
  ...enumLanguages.reduce(
    (acc, lang) => ({ ...acc, label: { ...acc.label, [lang]: '' } }),
    { label: {} }
  ),
});

type RowItem = { index: number } & Item & TRow;

export const EnumTable: FC<Props> = ({
  formik,
  onAddEnumValue,
  onRemoveEnumValue,
  onChangeEnumValue,
}) => {
  const { projectLanguages } = useCustomViewContext(
    (context: TMergedContext) => ({
      projectLanguages: context.project?.languages ?? [],
    })
  );
  const handleAddEnumClick = () => {
    const enumLanguages = getEnumLanguages(formik.values.values)(
      projectLanguages || []
    );
    onAddEnumValue(createEmptyLocalizedEnum(enumLanguages));
  };

  const intl = useIntl();

  const items =
    !formik.values.values || formik.values.values.length === 0
      ? [createEmptyLocalizedEnum(projectLanguages)]
      : formik.values.values;
  const rows = items.map(
    (item, index): RowItem => ({
      ...item,
      id: index.toString(),
      absoluteIndex: index,
      index,
    })
  );

  const renderEnum = ({
    row,
    rows,
    key,
    onChangeEnumValue,
  }: {
    row: RowItem;
    rows: Array<Item>;
    key: string;
    onChangeEnumValue: ({
      field,
      nextValue,
      absoluteIndex,
    }: {
      field: string;
      nextValue: string;
      absoluteIndex: number;
    }) => void;
  }) => {
    const nameAttribute = `enums.${row.index}.${key}`;
    const value =
      (key.startsWith('label')
        ? getLocalizedEnumLabel(row.label as LocalizedString, key)
        : row[key]) || '';

    switch (key) {
      case 'delete':
        return (
          <IconButton
            icon={<BinLinearIcon />}
            isDisabled={rows.length === 1}
            label="Delete List Item"
            size="medium"
            onClick={() => onRemoveEnumValue(row.absoluteIndex || 0)}
          />
        );
      default:
        return (
          <Fragment>
            <TextInput
              value={value}
              name={nameAttribute}
              // hasError={hasError}
              onChange={(event) => {
                onChangeEnumValue({
                  absoluteIndex: row.absoluteIndex || 0,
                  field: formToDocLocalizedEnumLabel(key),
                  nextValue: event.target.value,
                });
              }}
            />
            {/*{this.props.enumValueErrors.areAllEnumValuesEmpty && hasError && (*/}
            {/*  <ErrorMessage>*/}
            {/*    <FormattedMessage {...messages.areAllEnumValuesEmpty} />*/}
            {/*  </ErrorMessage>*/}
            {/*)}*/}
          </Fragment>
        );
    }
  };
  return (
    <Spacings.Stack scale="m">
      <Constraints.Horizontal max="scale">
        <DataTable
          columns={createColumnDefinitions(
            getEnumLanguages(formik.values.values)(projectLanguages || [])
          )}
          rows={rows}
          itemRenderer={(row, { key }) =>
            renderEnum({
              rows: items,
              row,
              key,
              onChangeEnumValue: onChangeEnumValue,
            })
          }
          footer={
            <SecondaryButton
              iconLeft={<PlusBoldIcon />}
              label={intl.formatMessage(messages.addEnumButtonLabel)}
              onClick={handleAddEnumClick}
            />
          }
        ></DataTable>
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};
