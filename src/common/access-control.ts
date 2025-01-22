import React from 'react';
import { useLoginStore } from '../store/useLoginStore'; // Adjust the import path as necessary

type FeScope = string[];

// Utility function to check access
const hasAccess = (
  feScopes: FeScope,
  module: string,
  action: string,
  fieldOrSubmodule?: string,
): boolean => {
  const fullScope = `${module}:${action}${
    fieldOrSubmodule ? `:${fieldOrSubmodule}` : ''
  }`;
  return (
    feScopes.includes(fullScope) ||
    feScopes.includes(`${module}:${action}:*`) || // Wildcard for all fields/submodules
    feScopes.includes(`${module}:*:*`) || // Full access to the module
    feScopes.includes(`*:*:*`) // Full access to all modules
  );
};

// Normal function to decide whether to render a component
const renderWithAccessControl = (
  component: React.ReactNode,
  module: string,
  action: string,
  fieldOrSubmodule?: string,
): React.ReactNode => {
  const { feScopes } = useLoginStore();

  if (hasAccess(feScopes, module, action, fieldOrSubmodule)) {
    return component;
  }

  return null; // Return null if access is denied
};

export default renderWithAccessControl;
