import { Space } from 'models';
import { _, errors, wrapper } from 'utils';

// TODO not everyone should be allowed to create new spaces
export default wrapper(({ body, user: { id } }) =>
  Space.create({ ...body, createdBy: id }).catch(error => {
    if (error.code === 'ConditionalCheckFailedException') {
      throw new errors.Conflict(_('errors.exists.id', body));
    }
    throw error;
  }),
);
