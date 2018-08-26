import 'reflect-metadata';
export const registeredClasses = [];
export function Database(value: string) {
  return function(target: Function) {
    registeredClasses.push(target);
    Reflect.defineMetadata('Database', value, target);
  };
}
