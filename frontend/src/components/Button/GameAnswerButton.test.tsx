import { faker } from "@faker-js/faker";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import GameAnswerButton from "./GameAnswerButton";

it("Matches snapshot", () => {
  const text = faker.lorem.word(2);
  const component = renderer.create(<GameAnswerButton text={text} />);
  const tree = component.toJSON() as ReactTestRendererJSON;
  expect(tree).toMatchSnapshot();
});
