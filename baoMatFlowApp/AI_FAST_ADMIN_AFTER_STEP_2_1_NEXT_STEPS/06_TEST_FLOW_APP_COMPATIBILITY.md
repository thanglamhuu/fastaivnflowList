# TEST ADMIN TOKEN WITH FLOW APP

Sau khi hoàn thành Admin Step 3:

Tạo một License test.

Input:

projectId:
Flow App thật

machineId:
Machine ID lấy từ Flow App

expiry:
+1 ngày

Dùng:

generateSignedLicenseToken()

Copy Token.

Test:

Admin Self Verify:
PASS

Flow App Verify:
PASS

Kiểm tra:

Signature
Project
Machine
Expiry
Issuer
Audience

Chỉ khi PASS mới phát hành Production License.