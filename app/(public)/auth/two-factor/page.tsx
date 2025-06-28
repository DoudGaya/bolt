'use client'

import { Suspense } from 'react'
// import TwoFactorForm from './two-factor-form'
import TwoFactorForm from './two-factor-form'

export default function TwoFactorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TwoFactorForm />
    </Suspense>
  )
}