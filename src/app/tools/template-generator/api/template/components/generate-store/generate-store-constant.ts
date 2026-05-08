/*
|-----------------------------------------
| setting up GenerateStoreConstant for the App
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
  bulk_action?: string[];
  use_generate_folder?: boolean;
  [key: string]: unknown;
}

interface InputConfig {
  uid: string;
  templateName: string;
  schema: Schema;
  namingConvention: NamingConvention;
}

const generateStoreConstant = (inputJson: string): string => {
  const config: InputConfig = JSON.parse(inputJson);
  const { namingConvention, schema } = config;

  const pluralLowerCase = namingConvention.users_2_000___; 
  const singularCapitalized = namingConvention.User_3_000___; 
  const bulkActions = namingConvention.bulk_action || [];

  let selectorArr = [`Store ${singularCapitalized} 1`, `Store ${singularCapitalized} 2`, `Store ${singularCapitalized} 3`];

  if (Array.isArray(bulkActions)) {
    for (const actionKey of bulkActions) {
      const schemaType = schema[actionKey];

      if (typeof schemaType === 'string' && schemaType.startsWith('SELECT#')) {
        const optionsString = schemaType.split('#')[1];

        if (optionsString) {
          selectorArr = optionsString.split(',').map(opt => opt.trim());
          break;
        }
      }
    }
  }

  const formattedSelectorArr = JSON.stringify(selectorArr).replace(/"/g, "'");

  const result = `
    export const defaultPageNumber = 2;
export const queryParams = { q: '', page: 1, limit: defaultPageNumber };
export const pageLimitArr = [defaultPageNumber, 20, 30, 40, 50];
export const  ${pluralLowerCase}SelectorArr  = ${formattedSelectorArr};

    `;
  return result;
};

export default generateStoreConstant;
