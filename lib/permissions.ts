/**
 * Permission utilities for role-based access control
 */

export enum UserRole {
  PAI = 'PAI',
  CRIANCA = 'CRIANCA',
}

export interface PermissionCheck {
  hasAccess: boolean
  message?: string
}

/**
 * Check if user has parent/caregiver role
 */
export function isParent(userRole: string | undefined): boolean {
  return userRole === UserRole.PAI
}

/**
 * Check if user has child role
 */
export function isChild(userRole: string | undefined): boolean {
  return userRole === UserRole.CRIANCA
}

/**
 * Permissions for different features
 */
export const Permissions = {
  /**
   * Can create and manage child profiles
   */
  manageChildren: (userRole: string | undefined): PermissionCheck => {
    if (isParent(userRole)) {
      return { hasAccess: true }
    }
    return {
      hasAccess: false,
      message: 'Apenas pais podem gerenciar perfis de crianças',
    }
  },

  /**
   * Can view and generate reports
   */
  viewReports: (userRole: string | undefined): PermissionCheck => {
    if (isParent(userRole)) {
      return { hasAccess: true }
    }
    return {
      hasAccess: false,
      message: 'Apenas pais podem visualizar relatórios',
    }
  },

  /**
   * Can create custom categories/albums
   */
  createCategories: (userRole: string | undefined): PermissionCheck => {
    if (isParent(userRole)) {
      return { hasAccess: true }
    }
    return {
      hasAccess: false,
      message: 'Apenas pais podem criar categorias personalizadas',
    }
  },

  /**
   * Can add custom images/pictograms
   */
  addCustomImages: (userRole: string | undefined): PermissionCheck => {
    if (isParent(userRole)) {
      return { hasAccess: true }
    }
    return {
      hasAccess: false,
      message: 'Apenas pais podem adicionar imagens personalizadas',
    }
  },

  /**
   * Can use AAC interface
   */
  useAAC: (userRole: string | undefined): PermissionCheck => {
    // Both parents and children can use the AAC interface
    if (isParent(userRole) || isChild(userRole)) {
      return { hasAccess: true }
    }
    return {
      hasAccess: false,
      message: 'Você não tem permissão para usar a interface AAC',
    }
  },

  /**
   * Can access dashboard
   */
  accessDashboard: (userRole: string | undefined): PermissionCheck => {
    if (isParent(userRole)) {
      return { hasAccess: true }
    }
    return {
      hasAccess: false,
      message: 'Apenas pais podem acessar o dashboard',
    }
  },

  /**
   * Can create child user accounts
   */
  createChildAccount: (userRole: string | undefined): PermissionCheck => {
    if (isParent(userRole)) {
      return { hasAccess: true }
    }
    return {
      hasAccess: false,
      message: 'Apenas pais podem criar contas para crianças',
    }
  },
}

/**
 * Get user's home page based on role
 */
export function getHomePageForRole(userRole: string | undefined): string {
  if (isChild(userRole)) {
    // Children go directly to AAC interface
    return '/aac'
  }
  
  // Parents go to dashboard
  return '/dashboard'
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(
  route: string,
  userRole: string | undefined
): PermissionCheck {
  // Public routes
  if (['/login', '/register', '/'].includes(route)) {
    return { hasAccess: true }
  }

  // Dashboard and reports - parents only
  if (route.startsWith('/dashboard') || route.startsWith('/reports')) {
    return Permissions.accessDashboard(userRole)
  }

  // AAC interface - both parents and children
  if (route.startsWith('/aac')) {
    return Permissions.useAAC(userRole)
  }

  // Default: require parent role
  return Permissions.accessDashboard(userRole)
}
