import { CheckActiveIcon, CheckInactiveIcon } from '@commercetools-uikit/icons';
import { FC } from 'react';

export interface Props {
  isTrue: boolean;
}
const BooleanIndicator: FC<Props> = ({ isTrue }) =>
  isTrue ? (
    <CheckActiveIcon size="big" color="primary" />
  ) : (
    <CheckInactiveIcon size="big" color="neutral60" />
  );
BooleanIndicator.displayName = 'BooleanIndicator';

export default BooleanIndicator;
