import { lazy } from 'react';

const CustomizableProductPrices = lazy(
  () => import('./customizable-product-prices')
);

export default CustomizableProductPrices;
