export enum StorePermissionEnum {
  // Manager permissions
  MANAGE_INVENTORY = 'manage_inventory',
  APPROVE_DISCOUNTS = 'approve_discounts',
  VIEW_SALES_DATA = 'view_sales_data',
  ASSIGN_TASKS = 'assign_tasks',

  // Cashier permissions
  PROCESS_SALES = 'process_sales',
  ISSUE_REFUNDS = 'issue_refunds',
  HANDLE_CASH = 'handle_cash',

  // Stock Manager permissions
  MANAGE_STOCK = 'manage_stock',
  TRACK_INVENTORY = 'track_inventory',
  GENERATE_REORDER_REQUESTS = 'generate_reorder_requests',

  // Customer Service permissions
  HANDLE_QUERIES = 'handle_queries',
  PROCESS_RETURNS = 'process_returns',
  ISSUE_DISCOUNTS = 'issue_discounts',

  // Delivery Personnel permissions
  UPDATE_DELIVERY_STATUS = 'update_delivery_status',
  VIEW_ASSIGNED_ORDERS = 'view_assigned_orders',
  MARK_ORDER_COMPLETED = 'mark_order_completed',
  ACCESS_ROUTE_DETAILS = 'access_route_details',
}

export enum PublicPermissionEnum {
  // Super Admin and Admin permissions
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  VIEW_REPORTS = 'view_reports',
  CONFIGURE_SETTINGS = 'configure_settings',
  MANAGE_TENANTS = 'manage_tenants',
  VIEW_SYSTEM_LOGS = 'view_system_logs',
}
