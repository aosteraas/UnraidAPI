import { parseVmHtml } from '../parseVmHtml';
import { vmHtml } from './data';

test('Parses raw VM HTML into array of VM data and extras string', () => {
  const { vms, extras } = parseVmHtml(vmHtml);
  expect(vms).toMatchSnapshot();
  expect(extras).toMatchSnapshot();
});
