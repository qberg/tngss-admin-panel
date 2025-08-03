import Image from 'next/image'
import icon from '@/assets/icon.png'
import { User } from '@/payload-types'
import React from 'react'

interface WelcomeMessageProps {
  user: User
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user }) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative aspect-square h-9">
        <Image className="object-contain" src={icon} alt="" />
      </div>
      <h1 className="text-red-500">Hey there, {user.name}</h1>
    </div>
  )
}

export default WelcomeMessage
