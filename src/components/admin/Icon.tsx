import React from 'react'
import icon from '@/assets/icon.png'
import Image from 'next/image'

export default function Icon() {
  return (
    <div>
      <Image className="h-20 object-contain" src={icon} alt="" />
    </div>
  )
}
