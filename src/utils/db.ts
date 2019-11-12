import dynamoose, { ModelConstructor, Schema, SchemaAttributes, SchemaOptions } from 'dynamoose';
import { isFunction, kebabCase, toPairs } from 'lodash';
import { verify } from 'utils';

const { ENVIRONMENT } = process.env;

dynamoose.setDefaults({
  prefix: `${ENVIRONMENT}_Onionful_`,
});

interface DataParser<DataSchema> {
  (data: DataSchema): DataSchema;
}

const complexId = (...parts: string[]) => parts.join(':');


interface DataSchemaCallback<DataSchema> {
  (data: DataSchema): DataSchema
}

interface Model<DataSchema, KeySchema> extends ModelConstructor<DataSchema, KeySchema> {
  updateWithId: (key: KeySchema, newKey: Partial<KeySchema>, data: DataSchema | DataSchemaCallback<DataSchema>) => Promise<DataSchema>
}

const model = <DataSchema, KeySchema>(
  table: string,
  attributes: SchemaAttributes,
  options: SchemaOptions = {},
): Model<DataSchema, KeySchema> => {
  // const handleValidators = (subattributes: SchemaAttributes, path: string[] = []) =>
  //   mapValues(subattributes, (entry, key) => {
  //     const nextPath = path.concat(key);
  //     if (!isPlainObject(entry)) {
  //       return entry;
  //     }
  //
  //     if (!('validator' in entry)) {
  //       return handleValidators(entry, nextPath);
  //     }
  //
  //     const { validator, ...rest } = entry;
  //
  //     return {
  //       ...rest,
  //       validate: (value: any) => {
  //         const { error } = Joi.validate(set({}, nextPath, value), set({}, nextPath, validator));
  //         if (error && error.details) {
  //           throw new errors.BadRequest(error.details.map(({ message }) => message).join());
  //         }
  //         return true;
  //       },
  //     };
  //   });

  const schema = new Schema(attributes, { throughput: 'ON_DEMAND', ...options });

  schema.static('updateWithId', function(
    this: ModelConstructor<DataSchema, KeySchema>,
    index: KeySchema,
    pair: Partial<KeySchema>,
    parseData: DataSchema | DataParser<DataSchema>,
    normalizer: (input: string) => string = kebabCase,
  ) {
    return this.get(index)
      // .then(verify.presence)
      .then(previous => {
        const body = isFunction(parseData) ? parseData(previous) : parseData;
        const [[key, id]] = toPairs(pair);
        // @ts-ignore
        const newId = normalizer(body[key]);

        if (!newId || id === newId) {
          // regular update, no id changed
          return this.update(index, body, { condition: 'attribute_exists(id)' });
        }

        return this.get({ ...index, id: newId })
          .then(verify.conflict)
          .then(() => this.create({ ...previous, ...body, ...index, id: newId }))
          .then(collection => this.delete(index).then(() => collection));
      });
  });

  return dynamoose.model(table, schema) as Model<DataSchema, KeySchema>;
};

export default {
  complexId,
  dynamoose,
  model,
};
