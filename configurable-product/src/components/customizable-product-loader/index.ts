import { lazy } from 'react';

const CustomizableProductLoader = lazy(
  () => import('./customizable-product-loader')
);

export default CustomizableProductLoader;
