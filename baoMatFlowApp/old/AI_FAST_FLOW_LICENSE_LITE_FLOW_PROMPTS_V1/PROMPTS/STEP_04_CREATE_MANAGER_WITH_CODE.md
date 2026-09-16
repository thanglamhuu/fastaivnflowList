Tạo:

src/license/aifastLicenseManager.ts


API:

activateLicense(token)

checkLicense()

getLicenseStatus()


Luồng:

activateLicense:
- gọi verifyLicense
- nếu đúng lưu token


checkLicense:
- đọc token
- verify lại


UI không gọi crypto trực tiếp.