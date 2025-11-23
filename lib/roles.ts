// lib/roles.ts
export const PARENT_ROLES = ['caregiver', 'PAI', 'parent']
export const CHILD_ROLES = ['child', 'CRIANCA']

export function isParentRole(role?: string): boolean {
  if (!role) return false
  return PARENT_ROLES.includes(role)
}

export function isChildRole(role?: string): boolean {
  if (!role) return false
  return CHILD_ROLES.includes(role)
}

// Normaliza roles legadas para os valores canônicos (inglês)
export function normalizeRole(role?: string): string {
  if (!role) return 'caregiver' // fallback padrão
  if (role === 'CRIANCA') return 'child'
  if (role === 'PAI') return 'caregiver'
  return role
}