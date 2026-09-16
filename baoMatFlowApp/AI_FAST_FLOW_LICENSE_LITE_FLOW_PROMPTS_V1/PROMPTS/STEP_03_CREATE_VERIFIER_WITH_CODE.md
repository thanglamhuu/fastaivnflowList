Tạo:

src/license/aifastLicenseVerifier.ts


Yêu cầu:

Tạo function:

verifyLicense(token)


Luồng bắt buộc:

1. Split token:
payload.signature

2. Import LICENSE_PUBLIC_JWK

3. Verify:

crypto.subtle.verify(
 {
  name:"ECDSA",
  hash:"SHA-256"
 },
 publicKey,
 signature,
 new TextEncoder().encode(payloadPart)
)


4. Decode payload

5. Check:

payload.projectId === PROJECT_ID

payload.machineId === getOrCreateMachineId()

payload.expiresAt > current time


Return:

{
 valid:true
}

hoặc:

{
 valid:false,
 reason:string
}

Không parse payload trước verify signature.