/*
|-----------------------------------------
| setting up GeneratePersonalToolkitSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

interface Schema {
  [key: string]: string | Schema;
}

interface NamingConvention {
  Users_1_000___: string;
  users_2_000___: string;
  User_3_000___: string;
  user_4_000___: string;
}

interface InputConfig {
  uid: string;
  templateName: string;
  isPersonal?: boolean; 
  schema: Schema;
  namingConvention: NamingConvention;
}

function generatePersonalRtkApiFileSlice(inputJson: string): string {
  const config: InputConfig = JSON.parse(inputJson);
  const { namingConvention, isPersonal } = config;

  const header = `// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'`;

  if (isPersonal) {
    const pluralCap = namingConvention.Users_1_000___;
    const pluralLow = namingConvention.users_2_000___;
    const singularCap = namingConvention.User_3_000___;

    return `${header}

export const personal${pluralCap}Api = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPersonal${pluralCap}: builder.query({
            query: ({ page, limit, q, author_email }) => {
                let url = \`/api/${pluralLow}/v1/personal?page=\${page || 1}&limit=\${limit || 10}&author_email=\${author_email}\`
                if (q) {
                    url += \`&q=\${encodeURIComponent(q)}\`
                }
                return url
            },
            providesTags: [{ type: 'tagType${pluralCap}', id: 'LIST' }],
        }),
        addPersonal${singularCap}: builder.mutation({
            query: (new${singularCap}) => ({
                url: '/api/${pluralLow}/v1/personal',
                method: 'POST',
                body: new${singularCap},
            }),
            invalidatesTags: [{ type: 'tagType${pluralCap}' }],
        }),
        updatePersonal${singularCap}: builder.mutation({
            query: ({ id, ...data }) => ({
                url: \`/api/${pluralLow}/v1/personal\`,
                method: 'PUT',
                body: { id, ...data },
            }),
            invalidatesTags: [{ type: 'tagType${pluralCap}' }],
        }),
        deletePersonal${singularCap}: builder.mutation({
            query: ({ id, 'author-email': authorEmail }) => ({
                url: \`/api/${pluralLow}/v1/personal\`,
                method: 'DELETE',
                body: { id, 'author-email': authorEmail },
            }),
            invalidatesTags: [{ type: 'tagType${pluralCap}' }],
        }),
        bulkUpdatePersonal${pluralCap}: builder.mutation({
            query: (bulkData) => ({
                url: \`/api/${pluralLow}/v1/personal?bulk=true\`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagType${pluralCap}' }],
        }),
        bulkDeletePersonal${pluralCap}: builder.mutation({
            query: (bulkData) => ({
                url: \`/api/${pluralLow}/v1/personal?bulk=true\`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagType${pluralCap}' }],
        }),
    }),
})

export const {
    useGetPersonal${pluralCap}Query,
    useAddPersonal${singularCap}Mutation,
    useUpdatePersonal${singularCap}Mutation,
    useDeletePersonal${singularCap}Mutation,
    useBulkUpdatePersonal${pluralCap}Mutation,
    useBulkDeletePersonal${pluralCap}Mutation,
} = personal${pluralCap}Api
`;
  } else {
    const template = `${header}

// Use absolute paths with leading slash to ensure consistent behavior
export const users_2_000___Api = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers_1_000___: builder.query({
            query: ({ page, limit, q }) => {
                let url = \`/api/users_2_000___/v1?page=\${page || 1}&limit=\${limit || 10}\`
                if (q) {
                    url += \`&q=\${encodeURIComponent(q)}\`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeUsers_1_000___', id: 'LIST' }],
        }),
        getUsers_1_000___Summary: builder.query({
            query: ({ page, limit }) => {
                return \`/api/users_2_000___/v1/summary?page=\${page || 1}&limit=\${limit || 10}\`
            },
            providesTags: [{ type: 'tagTypeUsers_1_000___', id: 'LIST' }],
        }),
        getUsers_1_000___ById: builder.query({
            query: (id) => \`/api/users_2_000___/v1?id=\${id}\`,
        }),
        addUsers_1_000___: builder.mutation({
            query: (newUsers_1_000___) => ({
                url: '/api/users_2_000___/v1',
                method: 'POST',
                body: newUsers_1_000___,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        updateUsers_1_000___: builder.mutation({
            query: ({ id, ...data }) => ({
                url: \`/api/users_2_000___/v1\`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        deleteUsers_1_000___: builder.mutation({
            query: ({ id }) => ({
                url: \`/api/users_2_000___/v1\`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        bulkUpdateUsers_1_000___: builder.mutation({
            query: (bulkData) => ({
                url: \`/api/users_2_000___/v1?bulk=true\`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        bulkDeleteUsers_1_000___: builder.mutation({
            query: (bulkData) => ({
                url: \`/api/users_2_000___/v1?bulk=true\`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
    }),
})

export const {
    useGetUsers_1_000___Query,
    useGetUsers_1_000___SummaryQuery,
    useAddUsers_1_000___Mutation,
    useUpdateUsers_1_000___Mutation,
    useDeleteUsers_1_000___Mutation,
    useBulkUpdateUsers_1_000___Mutation,
    useBulkDeleteUsers_1_000___Mutation,
    useGetUsers_1_000___ByIdQuery,
} = users_2_000___Api
`;

    let result = template.replaceAll('tagTypeUsers_1_000___', `tagType${namingConvention.Users_1_000___}`);
    result = result.replaceAll('newUsers_1_000___', `new${namingConvention.User_3_000___}`);
    result = result.replaceAll('Users_1_000___', namingConvention.Users_1_000___);
    result = result.replaceAll('users_2_000___', namingConvention.users_2_000___);

    return result;
  }
}

export default generatePersonalRtkApiFileSlice;
