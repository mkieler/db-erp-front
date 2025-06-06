import { userService } from '@/services/userService';
import { accessService } from '@/services/accessService';

export const useBackend = () => {
  return {
    userService: userService(),
    accessService: accessService(),
  };
};
