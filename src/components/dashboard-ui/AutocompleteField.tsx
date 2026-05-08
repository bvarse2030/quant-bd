/*
|-----------------------------------------
| setting up AutocompleteField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { Input } from '@/components/ui/input';
const AutocompleteField = ({ id, value }: { id: string; value: string }) => {
  return <Input value={value} id={id} readOnly />;
};
export default AutocompleteField;
