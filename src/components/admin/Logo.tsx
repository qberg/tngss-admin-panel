import React from 'react'
import logoDark from '@/assets/logo-dark.svg'
import logo from '@/assets/logo.svg'
import Image from 'next/image'

export default function Logo() {
  return (
    <div>
      <Image className="h-40 object-contain hidden dark:block" src={logoDark} alt="" />
      <Image className="h-40 object-contain block dark:hidden" src={logo} alt="" />
    </div>
  )
}
