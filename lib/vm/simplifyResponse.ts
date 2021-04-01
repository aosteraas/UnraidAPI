import { gatherDetailsFromEditVM } from './gatherDetailsFromEditVM';
import { VmDetails } from '../../models/vm';

export async function simplifyResponse(
  object,
  ip: string,
  auth: string,
): Promise<Record<string, VmDetails>> {
  const temp: Record<string, VmDetails> = {};
  for (let i = 0; i < object.length; i++) {
    const vm = object[i];
    let newVMObject: VmDetails = {
      name: '',
      id: '',
      status: '',
      icon: '',
      coreCount: 0,
      hddAllocation: {
        total: 1,
        all: [],
      },
      ramAllocation: 1,
      primaryGPU: '',
    };
    newVMObject.name =
      vm.parent.children[0].children[0].children[1].children[0].contents;
    newVMObject.id = vm.parent.children[0].children[0].children[0].tags.id.replace(
      'vm-',
      '',
    );
    newVMObject.status =
      vm.parent.children[0].children[0].children[1].children[1].children[1].contents;
    newVMObject.icon =
      vm.parent.children[0].children[0].children[0].children[0].tags.src;
    newVMObject.coreCount = vm.parent.children[2].children[0].contents;
    newVMObject.ramAllocation = vm.parent.children[3].contents;
    newVMObject.hddAllocation = {
      all: [],
      total: 0,
    };
    newVMObject.hddAllocation.all = [];
    newVMObject.hddAllocation.total = vm.parent.children[4].contents;
    if (vm.child.children[0].children[0].children[1].children) {
      vm.child.children[0].children[0].children[1].children.forEach(
        (driveDetails) => {
          const detailsArr = driveDetails.children.map((drive) => {
            return drive.contents;
          });
          const details = {
            path: detailsArr[0],
            interface: detailsArr[1],
            allocated: detailsArr[2],
            used: detailsArr[3],
          };
          newVMObject.hddAllocation.all.push(details);
        },
      );
    }
    newVMObject.primaryGPU = vm.parent.children[5].contents;
    newVMObject = await gatherDetailsFromEditVM(
      ip,
      newVMObject.id,
      newVMObject,
      auth,
    );
    temp[newVMObject.id] = newVMObject;
  }
  return temp;
}
