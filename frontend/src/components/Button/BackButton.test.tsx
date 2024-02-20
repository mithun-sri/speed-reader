import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import BackButton from "./BackButton";

it("Matches snapshot before/after click", () => {
  const component = renderer.create(<BackButton />);
  const tree1 = component.toJSON() as ReactTestRendererJSON;
  expect(tree1).toMatchSnapshot();

  renderer.act(() => {
    tree1.props.onClick();
  });
  const tree2 = component.toJSON() as ReactTestRendererJSON;
  expect(tree2).toMatchSnapshot();
});
