import Spacings from '@commercetools-uikit/spacings';
import { Row } from './row-form';
import { useFormik } from 'formik';
import { FC } from 'react';
import FieldLabel from '@commercetools-uikit/field-label';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { EnumTable, Item } from './enum-table';
type Formik = ReturnType<typeof useFormik>;

type Props = {
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

export const AttributeSettingsField: FC<Props> = ({ formik }) => {
  const handleAddEnumValue = (enumTemplate: Item) => {
    const enumDraftItemIndexes = formik.values.values?.length || 0;
    formik.setFieldValue(`values.${enumDraftItemIndexes}`, enumTemplate);
  };

  const handleRemoveEnumValue = (absoluteIndex: number) => {
    if (formik.values.values && formik.values.values[absoluteIndex]) {
      const nextEnumDraftItems = [...formik.values.values].splice(
        absoluteIndex,
        1
      );

      formik.setFieldValue('values', nextEnumDraftItems, false);
    }
  };

  const handleChangeEnumValue = ({
    field,
    nextValue,
    absoluteIndex,
  }: {
    field: string;
    nextValue: string;
    absoluteIndex: number;
  }) => {
    // if this is the first change, create the draft within the changes
    if (!formik.values.values || !formik.values.values[absoluteIndex]) {
      formik.setFieldValue(`values.${absoluteIndex}`, {
        key: '',
        label: undefined,
      });
    }
    // `field` can be `key` or `label` (or `label.de` depending on the attribute being localized or not)
    formik.setFieldValue(`values.${absoluteIndex}.${field}`, nextValue, false);
    formik.setFieldTouched(`values.${absoluteIndex}.${field}`, true);
  };

  return (
    <Spacings.Stack scale="l">
      <FieldLabel
        title={<FormattedMessage {...messages.attributeSettingsTitle} />}
      />
      <EnumTable
        formik={formik}
        onAddEnumValue={handleAddEnumValue}
        onChangeEnumValue={handleChangeEnumValue}
        onRemoveEnumValue={handleRemoveEnumValue}
      />
    </Spacings.Stack>
  );
};
