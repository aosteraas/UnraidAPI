import { VmDetails } from '@models/vm';
import create from 'zustand';

export interface Vm extends VmDetails {
  isBusy: boolean;
}

type VmStore = {
  vms: Vm[];
  setVms: (vms: Vm[]) => void;
  setBusy: (id: string, isBusy: boolean) => void;
  setStatus: (id: string, status: string) => void;
};

export const useVmStore = create<VmStore>((set) => ({
  vms: [],
  setVms: (vms) => set(() => ({ vms })),
  setBusy: (id, isBusy) =>
    set(({ vms }) => {
      const c = vms.map((c) => {
        if (c.id === id) {
          return { ...c, isBusy };
        }
        return c;
      });
      return { vms: c };
    }),
  setStatus: (id, status) =>
    set(({ vms }) => {
      const c = vms.map((c) => {
        if (c.id === id) {
          return { ...c, status };
        }
        return c;
      });
      return { vms: c };
    }),
}));
