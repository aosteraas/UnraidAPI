import { parseDockerHtml } from '../parseDockerHtml';
import { dockerHtml } from './data';

test('Processes raw Docker HTML into array of containers', async () => {
  const res = parseDockerHtml(dockerHtml);
  expect(res).toMatchSnapshot();
});

test.todo('Processes raw Docker HTML including images');
