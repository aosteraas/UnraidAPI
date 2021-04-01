interface ResponseModel {
  tags: Record<string, any>;
}
interface GroupedVmDetails {
  parent?: any;
  child?: any;
}

export function groupVmDetails(
  response: ResponseModel[],
  object: GroupedVmDetails[],
): void {
  response.forEach((row) => {
    if (row.tags['parent-id']) {
      if (!object[row.tags['parent-id']]) {
        object[row.tags['parent-id']] = {};
      }
      object[row.tags['parent-id']].parent = row;
    } else if (row.tags['child-id']) {
      if (!object[row.tags['child-id']]) {
        object[row.tags['child-id']] = {};
      }
      object[row.tags['child-id']].child = row;
    }
  });
}
