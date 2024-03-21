import { FC, ReactElement, JSX } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik, FormikErrors, FormikProvider } from 'formik';
import messages from './messages';
import Spacings from '@commercetools-uikit/spacings';
import TextField from '@commercetools-uikit/text-field';
import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';
import SelectField from '@commercetools-uikit/select-field';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { RowFormInputEnum } from '../row-form-input-enum/row-form-input-enum';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import LocalizedMultilineTextField from '@commercetools-uikit/localized-multiline-text-field';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { Item } from '../row-form-input-enum/row-form-input-enum-table';
import RowFormInputRange from '../row-form-input-range/row-form-input-range';
import RowFormStaticBundle from '../row-form-static-bundle/row-form-static-bundle';
import { ProductEntry } from '../product-field/product-field';

type Formik = ReturnType<typeof useFormik>;

export type RowConfig = {
  type?: 'color' | 'dropdown' | 'radio' | 'int-range' | 'static-bundle';
  isRequired?: boolean;
};

export type Row = {
  key: string;
  title: Record<string, string>;
  text: Record<string, string>;
  values: Array<Item> | undefined;
  rangeMin?: number;
  rangeMax?: number;
  unit?: Record<string, string>;
  products: Array<ProductEntry>;
  config: RowConfig;
};

type FormProps = {
  formElements: ReactElement;
  values: Formik['values'];
  isDirty: Formik['dirty'];
  isSubmitting: Formik['isSubmitting'];
  submitForm: Formik['handleSubmit'];
  handleReset: Formik['handleReset'];
};

export type TErrors = {
  key: { missing?: boolean; keyHint?: boolean };
  rangeMin: {};
  rangeMax: {};
};

const validate = (formikValues: Row): FormikErrors<Row> => {
  const errors: TErrors = {
    key: {},
    rangeMin: {},
    rangeMax: {},
  };

  if (!formikValues.key || TextInput.isEmpty(formikValues.key)) {
    errors.key.missing = true;
  }
  if (
    formikValues.key &&
    (formikValues.key.length < 2 || formikValues.key.length > 256)
  ) {
    errors.key.keyHint = true;
  }
  return omitEmpty(errors);
};

type Props = {
  onSubmit: (items: Row) => void;
  initialValues: Row;
  children: (formProps: FormProps) => JSX.Element;
};

const RowForm: FC<Props> = ({ onSubmit, initialValues, children }) => {
  const intl = useIntl();
  const { dataLocale } = useCustomViewContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  function handleSubmit(values: Row) {
    return onSubmit(values);
  }

  const formik = useFormik<Row>({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validate: validate,
    enableReinitialize: true,
  });

  const formElements = (
    <FormikProvider value={formik}>
      <Spacings.Stack scale="m">
        <TextField
          name="key"
          value={formik.values.key || ''}
          title={<FormattedMessage {...messages.keyTitle} />}
          isRequired
          touched={formik.touched.key}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errors={TextField.toFieldErrors<Row>(formik.errors).key}
        />
        <LocalizedTextField
          name="title"
          title={<FormattedMessage {...messages.titleTitle} />}
          isRequired={true}
          value={formik.values.title || {}}
          selectedLanguage={dataLocale}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <LocalizedMultilineTextField
          name="text"
          title={<FormattedMessage {...messages.titleText} />}
          value={formik.values.text || ''}
          selectedLanguage={dataLocale}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <SelectField
          name="type"
          isRequired={true}
          title={<FormattedMessage {...messages.attributeTypeTitle} />}
          options={[
            {
              value: 'color',
              label: intl.formatMessage(messages.colorChooser),
            },
            {
              value: 'int-range',
              label: intl.formatMessage(messages['int-range']),
            },
            {
              value: 'static-bundle',
              label: intl.formatMessage(messages.staticBundle),
            },
          ]}
          value={formik.values.config?.type}
          isClearable={false}
          isSearchable={false}
          onChange={({ target: { value: nextType } }) => {
            formik.setValues({
              ...formik.values,
              values: undefined,
              config: {
                // @ts-ignore
                type: nextType,
                isRequired: false,
              },
            });
          }}
          onBlur={formik.handleBlur}
          touched={
            formik.touched &&
            formik.touched.config &&
            formik.touched.config.type
          }
          //    errors={formik.errors.config && formik.errors.config.type}
          //  renderError={renderAttributeTypeErrors}
          horizontalConstraint="scale"
        />
        <CheckboxInput
          name="config.isRequired"
          isChecked={formik.values.config.isRequired}
          onChange={formik.handleChange}
        >
          <FormattedMessage {...messages.requiredLabel} />
        </CheckboxInput>
        {formik.values.config.type === 'color' && (
          <RowFormInputEnum formik={formik} />
        )}
        {formik.values.config.type === 'int-range' && <RowFormInputRange />}
        {formik.values.config.type === 'static-bundle' && (
          <RowFormStaticBundle />
        )}
      </Spacings.Stack>
    </FormikProvider>
  );

  return children({
    formElements: formElements,
    values: formik.values,
    isDirty: formik.dirty,
    isSubmitting: formik.isSubmitting,
    submitForm: formik.handleSubmit,
    handleReset: formik.handleReset,
  });
};
RowForm.displayName = 'RowForm';

export default RowForm;
