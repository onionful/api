import { wrapper } from './utils';

const list = () => {
  console.log('LIST USERS');
  return ['foo', 'bar'];
};

module.exports = {
  list: wrapper(list),
};
