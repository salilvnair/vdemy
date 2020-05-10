import createDataContext from "./createDataContext";

const progressBarReducer = (state, action) => {
  switch (action.type) {
    case "on_show":
      return { isHidden: false };
    case "on_hide":
      return { isHidden: true };
    default:
      return state;
  }
};

const show = (dispatch) => () => {
  dispatch({ type: "on_show" });
};

const hide = (dispatch) => () => {
  dispatch({ type: "on_hide" });
};

export const { Provider, Context } = createDataContext(
  progressBarReducer,
  { show, hide },
  { isHidden: true }
);
