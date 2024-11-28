import React from 'react';
import { ProfileScreenNavigationProp, RootStackParamList } from '../types/navigation';

type NonNullableKeys<T extends object> = {
  [K in keyof T]-?: undefined extends T[K] ? string : K;
}[keyof T];

type NullableKeys<T extends object> = {
  [K in keyof T]-?: undefined extends T[K] ? K : string;
}[keyof T];

export const navigationRef = React.createRef<ProfileScreenNavigationProp>();

export function navigate<K extends NullableKeys<RootStackParamList>>(
  name: K,
): void;
export function navigate<K extends NonNullableKeys<RootStackParamList>>(
  name: K,
  params: RootStackParamList[K] | any,
): void;
export function navigate<K extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[K]
    ? [K] | [K, RootStackParamList[K]]
    : [K, RootStackParamList[K]]
): void {
  //@ts-ignore
  navigationRef.current?.navigate(...args);
}

export function goBack(): void {
  console.log('object :>>  clicking',);
  navigationRef.current?.goBack();
}

export function reset(route: string): void {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name: route }],
  });
}
