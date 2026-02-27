'use client';

import { Suspense } from 'react';
import PermissionsContent from './PermissionsContent';

export default function PermissionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PermissionsContent />
    </Suspense>
  );
}
