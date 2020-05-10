import React from "react";
import "./progress-bar.component.scss";
import { Context as ProgressBarContext } from "../../context/ProgressBarContext";

class ProgressBar extends React.Component {
  static contextType = ProgressBarContext;
  render() {
    //console.log(this.context);
    const { isHidden } = this.context.state;
    return (
      <div id="loadingbar" className={isHidden ? "hide" : "show"}>
        <div id="loading__message">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/InternetSlowdown_Day.gif/120px-InternetSlowdown_Day.gif"
            alt="loading"
          />
        </div>
      </div>
    );
  }
}

export default ProgressBar;
