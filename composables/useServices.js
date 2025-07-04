import { userService } from '@/services/userService';
import { accessService } from '@/services/accessService';
import { inventoryService } from '@/services/inventoryService';
import { imageService } from '@/services/imageService';
import { activityService } from '@/services/activityService';
import { statisticsService } from '~/services/statisticsService';

export const useServices = () => {
  return {
    userService: userService(),
    accessService: accessService(),
    inventoryService: inventoryService(),
    imageService: imageService(),
    activityService: activityService(),
    statisticsService: statisticsService(),
  };
};
