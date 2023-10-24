import { ReactWrapper, ShallowWrapper } from "enzyme";

export const findByTestAttr = (component: ReactWrapper | ShallowWrapper, attr: string) => {
    const wrapper = component.find(`[data-test="${attr}"]`).hostNodes();
    return wrapper;
 };