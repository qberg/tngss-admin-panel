import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

export const anyoneFieldAcess: FieldAccess = () => true
