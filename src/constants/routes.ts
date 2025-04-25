export const MAIN_PATH = '/'
export const PATH_LOGIN = '/login'
export const PATH_REQUEST_RESET_PASSWORD = '/request_password_reset'
export const PATH_RESET_PASSWORD = '/reset_password'

// user
export const PATH_REGISTER_USER = '/user/register_user'
export const PATH_GET_USER_BY_USERNAME = '/user/get_user_info/:username'
export const PATH_GET_USER_LIST = '/user/get_user_list'
export const PATH_UPDATE_USER = '/user/update_user'
export const PATH_CHANGE_PASSWORD = '/user/change_password/:username'

// roles
export const PATH_CREATE_ROLE = '/roles/create_role'
export const PATH_ASSIGN_PERMISSION = '/roles/assign_permission'
export const PATH_GET_ROLES_LIST = '/roles/get_roles_list'
export const PATH_UPDATE_ROLE = '/roles/update_role'
export const PATH_GET_ALL_ROLES = '/roles/get_all_roles'
export const PATH_GET_ONE_ROLE = '/roles/get_one_role/:role_id'

// menu option
export const PATH_CREATE_MENU_OPTION = '/menu_options/create_menu_option'
export const PATH_GET_MENU_OPTIONS = '/menu_options/get_menu_options/:username'
export const PATH_GET_ALL_MENU_OPTIONS = '/menu_options/get_all_menu_options'

// customers
export const PATH_CRATE_CUSTOMER = '/customers/create_customer'
export const PATH_UPDATE_CUSTOMER = '/customers/update_customer'
export const PATH_GET_CUSTOMERS = '/customers/get_customers'
export const PATH_GET_ONE_CUSTOMER = '/customers/get_customer/:customer_id'

// customer tracking
export const PATH_LOGIN_CUSTOMER = '/customers/login_customer'
export const PATH_GET_CUSTOMER_TRACKING_ORDER =
  '/get_customer_tracking_order/:customer_id'
export const PATH_GET_CUSTOMER_TRACKING_ORDER_HISTORY =
  '/tracking/get_customer_tracking_order_history/:customer_id'

// repair orders
export const PATH_CREATE_REPAIR_ORDER = '/repair_order/create_repair_order'
export const PATH_UPDATE_ORDER_REPAIR = '/repair_order/update_repair_order'
export const PATH_GET_REPAIR_ORDERS = '/repair_order/get_repair_orders'
export const PATH_GET_PHONE_BRANDS = '/repair_order/get_phone_brands'
export const PATH_GET_ONE_DEVICE =
  '/repair_order/get_repair_order/:repair_order_id'
export const PATH_GET_REPAIR_ORDER_HISTORY =
  '/repair_order/get_repair_order_history'
export const PATH_CHANGE_ORDER_STATUS = '/repair_order/change_order_status'
export const PATH_GET_ORDER_RECEIPT =
  '/repair_order/get_receipt/:repair_order_id'

// products
export const PATH_CREATE_PRODUCT_HEADER = '/products/create_product'
export const PATH_UPDATE_PRODUCT_HEADER = '/products/update_product'
export const PATH_CREATE_PRODUCT_DETAIL = '/products/create_product_detail'
export const PATH_UPDATE_PRODUCT_DETAIL = '/products/update_product_detail'
export const PATH_GET_PRODUCT_HEADERS = '/products/get_product_headers'
export const PATH_GET_PRODUCTS = '/products/get_products'
export const PATH_GET_CATEGORIES = '/products/get_categories'
export const PATH_CREATE_CATEGORY = '/products/create_category'

// dashboard
export const PATH_GET_REPAIR_ORDERS_BY_STATUS = '/get_repair_orders_by_status'
export const PATH_GET_REPAIR_ORDERS_BY_MONTH = '/get_repair_orders_by_month'
export const PATH_GET_MONTHLY_INCOME = '/get_monthly_income'
export const PATH_GET_MOST_COMMON_DEVICES = '/get_most_common_devices'
export const PATH_GET_NEW_CUSTOMER_PER_MONTH = '/get_new_customer_per_month'
export const PATH_GET_AVERAGE_REPAIR_TIME_DAYS = '/get_average_repair_time_days'
export const PATH_GET_RECURRENT_CUSTOMERS_VS_NEW_CUSTOMERS =
  '/get_recurrent_customers_vs_new_customers'
