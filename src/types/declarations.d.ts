declare module 'react-native-vector-icons/Feather' {
  import { IconProps } from 'react-native-vector-icons/Icon';
  import { Component } from 'react';
  export default class Feather extends Component<IconProps> {}
}

declare module '@env' {
  export const API_BASE_URL: string;
  export const SERVER_SECRET: string;
  export const API_SERVER_SECRET: string;
}
