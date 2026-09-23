# ADMIN LICENSE UPDATE – STEP 5
# RENEW / REISSUE / CHANGE MACHINE
chỉnh app version thạnh 1.0.5
Mục tiêu:
Quản lý vòng đời License.

Prompt:

Tạo các chức năng:

1. Renew License

2. Reissue License

3. Change Machine

==================================================

Renew:

Tạo Token mới.

Không sửa Token cũ.

Giữ:

licenseId

Thay:

expiresAt

==================================================

Reissue:

Dùng khi cần cấp lại cùng:

projectId
machineId

Tạo signature mới.

==================================================

Change Machine:

Không sửa machineId trong Token cũ.

Tạo Token mới với:

machineId mới.

==================================================

Audit:

Lưu lịch sử:

old fingerprint
new fingerprint
action
time
admin user

==================================================

Không revoke bằng cách sửa payload.