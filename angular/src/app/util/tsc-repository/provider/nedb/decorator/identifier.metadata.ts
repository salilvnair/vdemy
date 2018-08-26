import 'reflect-metadata';
export const MY_PROPERTY_DECORATOR_KEY = 'Id';
export class Test {
  SEQ_TABLE_NAME: string;
}
export const Id = (options: Test): PropertyDecorator => {
  return (target, property) => {
    var classConstructor = target.constructor;
    //console.log('property target: ', classConstructor);
    const metadata =
      Reflect.getMetadata(MY_PROPERTY_DECORATOR_KEY, classConstructor) || {};
    metadata[property] = options;
    //console.log('property metadata: ', metadata);
    //console.log('property metadata[property]: ', metadata[property]);

    Reflect.defineMetadata(
      MY_PROPERTY_DECORATOR_KEY,
      metadata,
      classConstructor
    );
  };
};
