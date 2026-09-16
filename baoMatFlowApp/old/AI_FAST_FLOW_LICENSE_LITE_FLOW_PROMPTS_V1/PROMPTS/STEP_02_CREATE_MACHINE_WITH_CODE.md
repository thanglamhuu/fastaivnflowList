Tạo:

src/license/aifastMachine.ts


Code:

```typescript
const MACHINE_KEY="aifast.machineId";

export function getOrCreateMachineId(){

 let id=localStorage.getItem(MACHINE_KEY);

 if(!id){
  id=crypto.randomUUID();
  localStorage.setItem(MACHINE_KEY,id);
 }

 return id;
}
```

Không gọi server.