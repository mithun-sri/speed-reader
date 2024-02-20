import { faker } from "@faker-js/faker";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import GptButton from "./GptButton";

it("Matches snapshot before/after click", () => {
  const color = faker.color.human();
  const label = faker.lorem.word(5);
  const submit = faker.datatype.boolean();
  const component = renderer.create(
    <GptButton
      onButtonClick={() => {}}
      color={color}
      label={label}
      submit={submit}
    />,
  );
  const tree1 = component.toJSON() as ReactTestRendererJSON;
  expect(tree1).toMatchSnapshot();

  renderer.act(() => {
    tree1.props.onClick();
  });
  const tree2 = component.toJSON() as ReactTestRendererJSON;
  expect(tree2).toMatchSnapshot();
});
