import React from 'react';
import { ErrorPage } from '../../pages/ErrorPage';

export function NotFound() {
  return <ErrorPage errorCode="404" />;
} 