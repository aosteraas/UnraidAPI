import { VmChange } from 'hooks/useVmManager';
import { Vm } from 'store/vmStore';

interface Props {
  ip?: string;
  vm: Vm;
  start: VmChange;
  restart: VmChange;
  pause: VmChange;
  stop: VmChange;
  forceStop: VmChange;
}

export function VirtualMachine({
  ip,
  vm,
  start,
  stop,
  restart,
  forceStop,
  pause,
}: Props): JSX.Element {
  return (
    <p>
      <p>todo</p>
    </p>
  );
}
