import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import StartButton from "./StartButton";

it("Matches snapshot before/after click", () => {
  const component = renderer.create(<StartButton />);
  const tree1 = component.toJSON() as ReactTestRendererJSON;
  expect(tree1).toMatchSnapshot();

  renderer.act(() => {
    tree1.props.onClick();
  });
  const tree2 = component.toJSON() as ReactTestRendererJSON;
  expect(tree2).toMatchSnapshot();
});
