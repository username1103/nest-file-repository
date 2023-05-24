import {
  ClassProvider,
  FactoryProvider,
  ModuleMetadata,
  Type,
  ValueProvider,
} from '@nestjs/common';

export type CustomProvider<T> =
  | Type<T>
  | CustomClassProvider<T>
  | CustomValueProvider<T>
  | CustomFactoryProvider<T>;

export type CustomClassProvider<T> = Omit<ClassProvider<T>, 'provide'> & {
  useValue?: never;
  useFactory?: never;
};

export type CustomValueProvider<T> = Omit<ValueProvider<T>, 'provide'> & {
  useClass?: never;
  useFactory?: never;
};

export type CustomFactoryProvider<T> = Omit<FactoryProvider<T>, 'provide'> &
  Pick<ModuleMetadata, 'imports'> & {
    useClass?: never;
    useValue?: never;
  };
