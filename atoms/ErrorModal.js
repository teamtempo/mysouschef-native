import { atom } from 'recoil';

export const errorModal = atom({
  key: 'errorModal',
  default: [false, ""],
});