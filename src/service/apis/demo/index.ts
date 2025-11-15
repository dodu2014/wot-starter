// Import the core alova instance
import alovaInstance from '@/api/core/instance'

// Export the global Apis object from the generated code
import { createApis, withConfigType } from './createApis'

// Export the alova instance for direct use if needed
export { alovaInstance }

// Configure method options for specific APIs
export const $$userConfigMap = withConfigType({})

// Create the global Apis object
export const Apis = createApis(alovaInstance, $$userConfigMap)
