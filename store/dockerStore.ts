import create from 'zustand';
import { DockerContainer } from 'models/docker';

export interface Container extends DockerContainer {
  isBusy: boolean;
}

type DockerStore = {
  containers: Container[];
  setContainers: (containers: Container[]) => void;
  setBusy: (id: string, isBusy: boolean) => void;
};

export const useDockerStore = create<DockerStore>((set) => ({
  containers: [],
  setContainers: (containers) => set(() => ({ containers })),
  setBusy: (id, isBusy) =>
    set(({ containers }) => {
      const c = containers.map((c) => {
        if (c.containerId === id) {
          return { ...c, isBusy };
        }
        return c;
      });
      return { containers: c };
    }),
}));
