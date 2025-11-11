// Export the global Apis object from the generated code
import { createApis, mountApis, withConfigType } from './createApis'

// Import the core alova instance
import alovaInstance from '@/api/core/instance'

// Export the alova instance for direct use if needed
export { alovaInstance }

// Configure method options for specific APIs
export const $$userConfigMap = withConfigType({})

export const Webapi_Base = createApis(alovaInstance, $$userConfigMap)

mountApis(Webapi_Base)

// export default Webapi_Base
