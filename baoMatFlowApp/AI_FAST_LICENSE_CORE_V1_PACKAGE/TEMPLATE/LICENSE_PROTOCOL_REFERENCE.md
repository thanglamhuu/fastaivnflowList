# License Protocol Reference

Token:

payloadPart.signaturePart

Payload:

version
keyId
issuer
audience
licenseId
projectId
machineId
licensedEmailMasked
planLabel
issuedAt
expiresAt

Crypto:

ECDSA
P-256
SHA-256

Verify:

UTF8(payloadPart)