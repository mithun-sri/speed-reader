import { faker } from "@faker-js/faker";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import LogOut from "./LogOut";

it("Matches snapshot", () => {
  const fontSize = faker.number.int({ min: 10, max: 100 });
  const component = renderer.create(<LogOut fontSize={fontSize} />);
  const tree = component.toJSON() as ReactTestRendererJSON;
  expect(tree).toMatchSnapshot();
});
