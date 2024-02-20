import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import {
  StyledFormControl,
  StyledInputLabel,
  StyledSelect,
} from "./DropDownMenu";

it("Matches snapshots", () => {
  const component1 = renderer.create(<StyledFormControl />);
  const tree1 = component1.toJSON() as ReactTestRendererJSON;
  expect(tree1).toMatchSnapshot();

  const component2 = renderer.create(<StyledInputLabel />);
  const tree2 = component2.toJSON() as ReactTestRendererJSON;
  expect(tree2).toMatchSnapshot();

  const component3 = renderer.create(<StyledSelect />);
  const tree3 = component3.toJSON() as ReactTestRendererJSON;
  expect(tree3).toMatchSnapshot();
});
