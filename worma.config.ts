import { defineConfig } from 'wormajs'
import { alovaGlobals } from 'wormajs/plugin'

export default defineConfig({
  generator: [
    // demo
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      input: 'https://petstore3.swagger.io/api/v3/openapi.json',
      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      output: 'src/service/apis/demo',
      plugins: [alovaGlobals({ global: 'Apis' })],

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // version: 3,

      /** Generated code format. */
      type: 'typescript',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescripor object is not converted
       */
      handleApi: (apiDescriptor) => {
        // Skip logging to console
        // console.log(apiDescriptor)

        // Filter out any deprecated APIs if needed
        if (apiDescriptor.deprecated) {
          return undefined // Skip this API
        }
        // You can transform the API descriptor here if needed
        // For example, add custom headers, modify parameters, etc.

        return apiDescriptor
      },
    },
    // app
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      input: 'http://localhost:5001/openapi/App.json',
      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      output: 'src/service/apis/app',
      plugins: [alovaGlobals({ global: 'Webapi_App' })],

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // version: 3,

      /** Generated code format. */
      type: 'typescript',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescripor object is not converted
       */
      handleApi: (apiDescriptor) => {
        // Skip logging to console
        // console.log(apiDescriptor)

        // Filter out any deprecated APIs if needed
        if (apiDescriptor.deprecated) {
          return undefined // Skip this API
        }
        // You can transform the API descriptor here if needed
        // For example, add custom headers, modify parameters, etc.

        return apiDescriptor
      },
    },
    // base
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      input: 'http://localhost:5001/openapi/Base.json',
      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      output: 'src/service/apis/base',
      plugins: [alovaGlobals({ global: 'Webapi_Base' })],

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // version: 3,

      /** Generated code format. */
      type: 'typescript',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescripor object is not converted
       */
      handleApi: (apiDescriptor) => {
        // Skip logging to console
        // console.log(apiDescriptor)

        // Filter out any deprecated APIs if needed
        if (apiDescriptor.deprecated) {
          return undefined // Skip this API
        }
        // You can transform the API descriptor here if needed
        // For example, add custom headers, modify parameters, etc.

        return apiDescriptor
      },
    },
    // weixin
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      input: 'http://localhost:5001/openapi/Weixin.json',
      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      output: 'src/service/apis/weixin',
      plugins: [alovaGlobals({ global: 'Webapi_Weixin' })],

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // version: 3,

      /** Generated code format. */
      type: 'typescript',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescripor object is not converted
       */
      handleApi: (apiDescriptor) => {
        // Skip logging to console
        // console.log(apiDescriptor)

        // Filter out any deprecated APIs if needed
        if (apiDescriptor.deprecated) {
          return undefined // Skip this API
        }
        // You can transform the API descriptor here if needed
        // For example, add custom headers, modify parameters, etc.

        return apiDescriptor
      },
    },
    // service demo
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      input: 'http://localhost:5001/openapi/Demo.json',
      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      output: 'src/service/apis/demo2',
      plugins: [alovaGlobals({ global: 'Webapi_Demo' })],

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // version: 3,

      /** Generated code format. */
      type: 'typescript',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescripor object is not converted
       */
      handleApi: (apiDescriptor) => {
        // Skip logging to console
        // console.log(apiDescriptor)

        // Filter out any deprecated APIs if needed
        if (apiDescriptor.deprecated) {
          return undefined // Skip this API
        }
        // You can transform the API descriptor here if needed
        // For example, add custom headers, modify parameters, etc.

        return apiDescriptor
      },
    },
  ],
})
