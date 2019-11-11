import Joi, { extend, Root, StringSchema } from '@hapi/joi';

interface ExtendedJoi extends Root {
  complexId(): StringSchema;

  id(): StringSchema;
}

// const extendedJoi: ExtendedJoi = Joi.extend(
//   {
//     name: 'id',
//     base: Joi.string()
//       .regex(/^[a-z0-9-]+$/)
//       .lowercase()
//       .min(3)
//       .max(64)
//       .truncate(),
//   },
//   {
//     name: 'complexId',
//     base: Joi.string()
//       .regex(/^[a-z0-9-]+:[a-z0-9-]+$/)
//       .lowercase()
//       .min(7)
//       .max(129)
//       .truncate(),
//   },
// );

export default Joi;
