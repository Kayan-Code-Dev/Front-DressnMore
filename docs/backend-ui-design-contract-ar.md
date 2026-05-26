# Front-DressnMore - Backend Documentation (Design-First)

> إصدار: 1.0  
> اللغة: العربية  
> الغرض: توثيق متطلبات الباك-إند بناءً على **كود التصميم/الواجهات فقط** من النظام القديم، بدون نسخ منطق API/Auth القديم.

---

## 1) نطاق الوثيقة

هذه الوثيقة مبنية على تحليل واجهات المشروع القديم (`erp-bahaa-eldin-front`) كمصدر تصميم فقط:

- الصفحات والمسارات (Routes)
- الجداول والفلاتر
- نماذج الإدخال (Create/Edit)
- الحالات (Statuses)
- الحقول المطلوبة في العرض

### مهم جدًا

1. لا نعتمد على API القديم كمرجع نهائي.
2. لا نعتمد على Auth القديم.
3. لا نعتمد على Base URLs القديمة أو أي host ثابت.
4. لا نعتمد على hardcoded tenant logic.
5. هذه الوثيقة تحدد **عقد UI** الذي يحتاجه الباك-إند ليخدم الواجهة الجديدة.

---

## 2) العقود العامة (Global Contracts)

## 2.1 نمط المصادقة والـ Tenant (ملزم)

- Tenant login: `POST /api/tenant/login`
- كل طلب tenant يجب أن يحتوي:
  - `Authorization: Bearer <token>`
  - `X-Tenant: <workspace>`
  - `Accept: application/json`

## 2.2 شكل الاستجابة القياسي

نجاح:

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": {}
}
```

فشل:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

## 2.3 Paginated List Contract (متوقع من الواجهة)

الواجهات الحالية تعتمد كثيرًا على:

```json
{
  "data": [],
  "current_page": 1,
  "total": 0,
  "total_pages": 0
}
```

يفضل إبقاء هذا الشكل داخل `data` أو `meta` بشكل ثابت بين كل الـ list endpoints.

## 2.4 تنسيقات البيانات

- التواريخ: `YYYY-MM-DD` للفلاتر، و `ISO datetime` للحقول الزمنية التفصيلية.
- المبالغ: يفضل `number`، مع السماح مؤقتًا بـ `string` إذا لزم.
- التصدير (Export): ملفات Blob + `Content-Disposition` لتسمية الملف.

---

## 3) المصادقة (Login/Auth)

### 3.1 الشاشات

- `/login`
- `/forget-password`
- `/verify-otp`
- `/reset-password`

### 3.2 حقول النماذج من التصميم

- Login:
  - `email`
  - `password`
- Forget password:
  - `role`
  - `email`
- Verify OTP:
  - `code`
- Reset password:
  - `password`
  - `confirmPassword`

### 3.3 Contract مقترح للباك-إند

- `POST /api/tenant/login`
  - Body: `{ email, password }`
  - يرجع: `{ token, user, roles?, permissions? }`
- `POST /api/tenant/forgot-password`
- `POST /api/tenant/verify-otp`
- `POST /api/tenant/reset-password`
- `POST /api/tenant/logout`

> ملاحظة: endpoint `/admin/login` في القديم يتم تجاهله.

---


## 3.4 خريطة المسارات الأساسية (UI Routes)

| Module | Route(s) |
|---|---|
| Auth | `/login`, `/forget-password`, `/verify-otp`, `/reset-password` |
| Dashboard | `/dashboard` |
| Customers | `/clients` |
| Categories | `/content/categories` |
| Subcategories | `/content/sub-categories` |
| Branches | `/branch` |
| Dresses | `/clothes/list`, `/clothes/details/:id` |
| Inventory | `/inventory` + subroutes (`branches`, `branches-managers`, `employees`) |
| Orders/Invoices | `/orders/list`, `/orders/choose-client`, `/orders/create-order`, `/orders/:id` |
| Sales | `/sales/invoices`, `/sales/choose-client`, `/sales/create-invoice` |
| Tailoring | `/tailoring/invoices`, `/tailoring/choose-client`, `/tailoring/orders` |
| Payments | `/payments` |
| Deliveries | `/deliveries` |
| Returns | `/returns` |
| Overdue Returns | `/overdue-returns` |
| Expenses | `/expenses` |
| Cash Movements | `/cashboxes/transactions` |
| Suppliers | `/suppliers`, `/suppliers/orders` |
| Reports | `/sales/reports`, `/tailoring/reports` |
| Settings | `/account` |

---

## 4) Dashboard

### 4.1 فلاتر

- `period`: `today|week|month|year|last_week|last_month`
- `date_from`
- `date_to`
- `branch_id`
- `department_id`

### 4.2 البيانات المطلوبة للـ widgets/charts

- Activity:
  - `total_activities`, `by_action`, `by_entity_type`
- Business:
  - Sales: `total_revenue`, `order_count`, `average_order_value`, `by_status`
  - Clients: `new_clients`, `total_clients`, `active_clients`, `growth_rate`
  - Payments: `total_payments`, `payment_count`, `by_method`
  - Inventory: `total_items`, `available`, `out_of_branch`, `utilization_rate`
  - Financial: `total_income`, `total_expenses`, `profit`, `profit_margin`, `cashbox_balances[]`
- HR:
  - attendance/payroll/activity/trends

### 4.3 عملية مطلوبة

- `GET /api/tenant/dashboard/overview`

---

## 5) Customers (Clients)

### 5.1 شاشة وقائمة

- أعمدة الجدول:
  - `name`
  - `date_of_birth`
  - `national_id`
  - `phones[]`

### 5.2 فلاتر القائمة

- `search`, `id`, `address_id`, `source`
- `date_of_birth_from`, `date_of_birth_to`
- `page`, `per_page`

### 5.3 نموذج Create/Edit

- `name`
- `date_of_birth`
- `national_id`
- `source`
- `phone`, `phone2` (أو phones[])
- `address` (نصي)
- `city_id`
- `notes`

### 5.4 عمليات مطلوبة

- List / Details / Create / Update / Delete / Export

---

## 6) Dress Categories + Subcategories

## 6.1 Categories

- الحقول:
  - `name`
  - `description`
- جدول:
  - `name`, `description`
- عمليات:
  - CRUD + Export

## 6.2 Subcategories

- الحقول:
  - `category_id`
  - `name`
  - `description`
- جدول:
  - `name`, `category_name`, `description`
- عمليات:
  - CRUD + Export

---

## 7) Branches

### 7.1 جدول الفروع

- `image`
- `branch_code`
- `name`
- `address`
- `inventory_name`
- `currency`
- `vat_*`
- `phone`

### 7.2 نموذج الفرع

- `branch_code`
- `name`
- `phone`
- `vat_enabled`
- `vat_type` (`fixed|percentage`)
- `vat_value`
- `currency_id`
- `street`
- `building`
- `city_id`
- `notes`
- `inventory_name`
- `image` (اختياري)

### 7.3 عمليات مطلوبة

- CRUD + Export

---

## 8) Dresses (Clothes)

### 8.1 جدول الملابس

- `name/description`
- `code`
- قياسات (`breast_size`, `waist_size`, `sleeve_size`)
- `branch/entity`
- `status`
- `price`

### 8.2 فلاتر

- `id`, `search`, `name`, `code`
- `branch_id`, `inventory_id`, `entity_type`, `entity_id`
- `category_id`, `subcat_id[]`
- `status`
- `created_from`, `created_to`
- فلاتر التوفر: `delivery_date`, `days_of_rent`, `occasion_datetime`, `visit_datetime`

### 8.3 نموذج Create/Edit

- `code`
- `status`
- `entity_type`, `entity_id`
- `category_id`
- `subcategory_ids[]`
- قياسات: `breast_size`, `waist_size`, `sleeve_size`
- `notes`, `description`, `measurements`

### 8.4 عمليات إضافية مطلوبة

- `GET cloth orders history`
- `GET available-for-date`
- `GET unavailable-days`
- `Import/Export`

---

## 9) Inventory

> ملاحظة: هذا الجزء في القديم مبني على طبقة API legacy منفصلة.  
> في الجديد نحتاج API موحد ومنظف.

### 9.1 جداول

- عناصر مخزون:
  - `name`, `category`, `subcategory`, `quantity`, `status`, `updated_at`
- تحويلات:
  - `item`, `quantity`, `from_branch`, `to_branch`, `status`, `request_date`, `arrival_date`

### 9.2 نماذج

- Create/Edit inventory item:
  - `code` (في بعض السياقات)
  - `name`
  - `category_id`
  - `subCategories_id`
  - `price`
  - `quantity`
  - `type` (`raw|product`)
  - `notes`
- Create transfer:
  - `from_branch_id` (حسب الدور)
  - `to_branch_id`
  - `category_id`
  - `subCategories_id`
  - `quantity`
  - `notes`

### 9.3 عمليات مطلوبة

- Inventory CRUD حسب سياق الجهة
- Transfer create/list
- Transfer approve/reject

---

## 10) Invoices (Orders + Sales + Tailoring)

## 10.1 Orders (الفواتير الأساسية)

### قائمة/تفاصيل
- بيانات عميل
- تواريخ (`visit_datetime`, `delivery_date`, `occasion_datetime`)
- عناصر الفاتورة + المبالغ + الحالة
- الموظف

### فلاتر متوقعة
- `status`, `search`, `page`, `per_page`
- `client_id`, `employee_id`, `branch_id`, `inventory_id`
- `date_from`, `date_to`
- متغيرات الإرجاع/التأخير

### نموذج إنشاء/تحديث الفاتورة
- `client_id` أو عميل جديد
- `entity_type`, `entity_id`
- `delivery_date`
- `visit_datetime`
- `occasion_datetime`
- `days_of_rent`
- خصم:
  - `discount_type`
  - `discount_value`
- `items[]` وكل عنصر:
  - `cloth_id`
  - `price`
  - `type`
  - `quantity`
- `paid` / بيانات دفع
- `order_notes`

### عمليات حالة
- Deliver
- Cancel
- Return full
- Return item
- Add/Pay/Cancel payment
- Export

## 10.2 Sales Invoices

### جدول
- `invoice_number`
- `client`
- `items_count`
- `total_amount`
- `total_paid`
- `total_remaining`
- `created_at`

### نموذج إنشاء/تعديل
- `client_id` أو عميل جديد
- `branch_id`
- `employee_id`
- `delivery_date`
- `items[]`:
  - `product_id`, `quantity`, `unit_price`, `discount?`
- `discount`
- `payment_amount`
- `payment_method` (`cash|bank_transfer|check`)
- `cashbox_id`
- `notes`

### تقارير
- `date_from`, `date_to`, `branch_id`, `employee_id`

## 10.3 Tailoring Invoices/Orders

### حالات التفصيل
- `new`
- `in_progress`
- `at_option`
- `ready_for_trial`
- `ready_for_delivery`
- `delivered`

### إنشاء فاتورة تفصيل
- `client_id`
- `piece_type`
- `measurements` (key-value)
- `fabric`
- `notes`
- `delivery_date`
- `price`
- `deposit`

### قوائم وفلاتر
- `client_id`, `status`, `date_from`, `date_to`

### تقارير
- `total_orders`, `ready_orders`, `late_orders`, `in_progress_orders`, `total_revenue`

---

## 11) Payments

### 11.1 جدول

- `client`
- `branch`
- `amount`
- `status` (`pending|paid|canceled`)
- `payment_type` (`initial|fee|normal`)
- `payment_date`
- `created_at`
- `notes`

### 11.2 فلاتر

- `search`
- `status`
- `payment_type`
- `branch_id`
- `client_id`
- `order_id`
- `employee_id`
- `inventory_id`
- `date_from`, `date_to`
- `amount_min`, `amount_max`
- `page`, `per_page`

### 11.3 عمليات

- List / details / create / pay / cancel / export

---

## 12) Delivery / Return / Overdue Return

### 12.1 Deliveries filters

- `order_id`, `client_id`, `employee_id`
- `cloth_name`, `cloth_code`
- `visit_date_from`, `visit_date_to`
- `delivery_date_from`, `delivery_date_to`
- `return_date_from`, `return_date_to`
- مع status business rule: Paid/ready for delivery

### 12.2 Returns filters

- نفس فلاتر التسليمات تقريبًا
- business rule: delivered + delayed=false

### 12.3 Overdue returns filters

- `client_id`
- business rule: delayed=true

### 12.4 بيانات الجدول

- بيانات العميل
- تواريخ وإجراءات
- الأصناف/المبالغ/الحالة
- الموظف

---

## 13) Expenses

### 13.1 جدول

- `branch`
- `cashbox`
- `category/subcategory`
- `vendor`
- `amount`
- `expense_date`
- `status` (`pending|approved|paid|cancelled`)

### 13.2 فلاتر

- `branch_id`, `cashbox_id`
- `category`, `subcategory`
- `status`
- `start_date`, `end_date` (أو date_from/date_to)
- `amount_min`, `amount_max`
- `vendor`, `reference_number`
- `created_by`, `approved_by`
- `transaction_id`
- `search`

### 13.3 نموذج Create/Edit

- `branch_id` (في الإنشاء)
- `category`
- `subcategory`
- `amount`
- `expense_date`
- `vendor`
- `reference_number`
- `description`
- `notes`

### 13.4 عمليات

- Create / update / delete
- Approve / cancel / pay
- Summary
- Export

---

## 14) Cash Movements + Cashboxes

## 14.1 Cashboxes

- حقول رئيسية:
  - `name`, `branch_id`, `initial_balance`, `current_balance`
  - `description`, `is_active`
- عمليات:
  - list/details/update
  - daily summary
  - recalculate
  - export

## 14.2 Transactions (Cash Movements)

- حقول رئيسية:
  - `cashbox_id`
  - `type` (`income|expense`)
  - `category` (`payment|expense|salary_expense|receivable_payment`)
  - `amount`
  - `balance_after`
  - `description`
  - `reference_type`, `reference_id`
  - `is_reversed`
  - `created_at`

- فلاتر:
  - `cashbox_id`
  - `start_date`, `end_date`
  - `sort`
  - `page`, `per_page`

---

## 15) Suppliers

### 15.1 Suppliers list

- بيانات المورد
- ملخص مشتريات/مرتجعات
- الرصيد والحساب

### 15.2 Supplier create/edit

- `name`
- `code`
- `phone`
- `address`

### 15.3 Supplier Orders

#### الحقول الرئيسية
- `supplier_id`
- `category_id`
- `subcategory_id`
- `branch_id`
- `order_number`
- `type`
- `order_date`
- `status`
- `total_amount`
- `payment_amount`
- `remaining_payment`
- `notes`
- `clothes[]`:
  - `cloth_id` أو `code`
  - `price`
  - `payment`
  - `remaining`
  - `category_id`, `subcategory_ids[]`
  - `entity_type`, `entity_id`

#### عمليات
- Supplier order CRUD
- Add payment to supplier order
- Return supplier order
- Export suppliers + supplier orders

---

## 16) Reports

### 16.1 Sales reports

- مدخلات:
  - `date_from`, `date_to`
  - `branch_id`
  - `employee_id`
- مخرجات:
  - `total_sales`
  - `invoices_count`
  - `average_invoice_value`

### 16.2 Tailoring reports

- مدخلات:
  - `date_from`, `date_to`
  - `branch_id`
- مخرجات:
  - `total_orders`
  - `ready_orders`
  - `late_orders`
  - `in_progress_orders`
  - `total_revenue`

---

## 17) Accounting (منظور UI)

من واقع التصميم، شاشة Accounting عبارة عن تجميع من:

- Cashboxes
- Transactions
- Payments
- Expenses

الحد الأدنى المطلوب:

- endpoint ملخص يومي/شهري:
  - total income
  - total expenses
  - net change
  - balances by cashbox
- endpoint ledger موحد حسب range date

---

## 18) Settings

### 18.1 Account settings

- Profile fields:
  - `name`
  - `email`
  - `avatar` / `avatar_remove`
  - `logo` / `logo_remove`
- Password change:
  - `current_password`
  - `new_password`
  - `new_password_confirmation`
- Delete account:
  - `password`

### 18.2 عمليات

- `GET profile`
- `POST/PUT profile`
- `POST change password`
- `DELETE account`

---

## 19) بيانات كانت Hardcoded في التصميم ويجب Backend-ize

1. شجرة تصنيفات المصروفات (`category/subcategory`) كانت static.
2. بعض labels/status mappings في الواجهة.
3. بعض mock data (خصوصًا tailoring mock) يجب استبدالها ببيانات حقيقية.

---

## 20) Checklist لفريق الباك-إند قبل البدء

1. تثبيت tenant middleware على كل endpoints (باستثناء login حسب القرار النهائي).
2. توحيد envelope الاستجابة (`success/message/data/meta`).
3. توحيد validation errors داخل `errors`.
4. توحيد pagination.
5. دعم export endpoints بنوع Blob واسم ملف.
6. تثبيت status enums لكل domain.
7. منع أي اعتماد على legacy routes من النظام القديم.

---

## 21) ملاحظة تنفيذية

هذا المستند يمثل **مصدر الحقيقة من جهة التصميم UI**.  
أي endpoint naming داخلي يمكن تغييره من فريق الباك-إند، بشرط الحفاظ على:

- نفس الحقول المتوقعة في الشاشات.
- نفس السلوك (filters/actions/status transitions).
- نفس شكل الاستجابة القياسي المذكور أعلاه.

