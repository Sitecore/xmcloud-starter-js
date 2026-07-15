import * as FEAAS from '@sitecore-feaas/clientside/react';

// An important boilerplate component that prevents BYOC components from being optimized away and allows then. Should be kept in this file.
const ClientsideComponent = (props: FEAAS.ExternalComponentProps) => FEAAS.ExternalComponent(props);
export default ClientsideComponent;
