import * as FEAAS from '@sitecore-feaas/clientside/react';

// An important boilerplate component that prevents BYOC components from being optimized away and allows then. Should be kept in this file.
const ClientsideComponent = (props: FEAAS.ExternalComponentProps) => FEAAS.ExternalComponent(props);
/**
 * Clientside BYOC component will be rendered in the browser, so that external components:
 * - Can have access to DOM apis, including network requests
 * - Use clientside react hooks like useEffect.
 * - Be implemented as web components.
 */
export default ClientsideComponent;
