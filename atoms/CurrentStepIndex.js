import { atom } from 'recoil';

export const currentStepIndex = atom({
  key: 'currentStepIndex',
  default: 0,
});