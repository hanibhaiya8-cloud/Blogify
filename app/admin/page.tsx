'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated } from '../../lib/auth'

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Client-side auth check: redirect accordingly
    if (isAdminAuthenticated()) {
      router.replace('/admin/add')
    } else {
      router.replace('/admin/login')
    }
  }, [router])

  // Optional minimal UI while redirecting
  return null
}
