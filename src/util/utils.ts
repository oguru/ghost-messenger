import { TextInputType } from "../type-definitions";

export const isKeyboardEvent = (
    e: TextInputType
): e is React.KeyboardEvent<HTMLInputElement> => {
    return 'key' in e;
}