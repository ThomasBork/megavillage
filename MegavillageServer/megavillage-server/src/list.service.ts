import { Injectable } from '@nestjs/common';

@Injectable()
export class ListService {
  public findFirstEmptyIndex<T>(list: T[], size: number): number | undefined {
    for(let i = 0; i<size; i++) {
      if (list[i] === null || list[i] === undefined) {
        return i;
      }
    }
    return undefined;
  }
  public areListsIdentical<T extends object>(listA: T[], listB: T[]): boolean {
    if (listA.length !== listB.length) {
      return false;
    }
    return listA.every((a) => listB.some((b) => {
      for (const propertyName in a) {
        if (a[propertyName] !== b[propertyName]) {
          return false;
        }        
      }
      return true;
    }));
  }
}
