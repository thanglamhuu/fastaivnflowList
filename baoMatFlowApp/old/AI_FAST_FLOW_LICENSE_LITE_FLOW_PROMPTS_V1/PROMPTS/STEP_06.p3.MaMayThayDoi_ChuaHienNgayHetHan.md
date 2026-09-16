Bạn đang sửa AI FAST LICENSE LITE.

Hiện tượng:

Machine ID thay đổi mỗi lần mở app.

Nguyên nhân:
Flow runtime có thể reset localStorage.

Yêu cầu:

Sửa file:

src/license/aifastMachine.ts


Không thay đổi:
- License token format
- Verify logic
- Public Key


Thay toàn bộ nội dung bằng:


```typescript
const MACHINE_KEY = "aifast.machineId";


async function savePersistentMachineId(id:string){

  try {

    localStorage.setItem(
      MACHINE_KEY,
      id
    );

  } catch(e){}


  try {

    const db =
      await indexedDB.open(
        "aifast_license",
        1
      );

  } catch(e){}

}



export function getOrCreateMachineId(){

  let id =
    localStorage.getItem(
      MACHINE_KEY
    );


  if(!id){

    id =
      crypto.randomUUID();


    localStorage.setItem(
      MACHINE_KEY,
      id
    );

  }


  return id;
}

Sau khi sửa:

Không tạo machineId mới nếu đã tồn tại.
Giữ nguyên machineId giữa các lần mở app.
Không thay đổi verifier.

Báo cáo:

FILE UPDATED:
src/license/aifastMachine.ts

STATUS:
SUCCESS