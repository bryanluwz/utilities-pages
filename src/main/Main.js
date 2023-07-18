import { Component } from "react";
import { ContentDisplay } from "../components/others/";

export default class Main extends Component {
	render() {
		return (
			<ContentDisplay
				backButtonRoute={"https://bryanluwz.github.io/"}
				displayName={Main.displayName}
				displayClearHistory={false}
				faIcon={"fa-trash"}
				contentBodyAdditionalClasses={[]}
				router={this.props.router}
				handleHeaderTitleClick={() => { }}
			>

			</ContentDisplay>
		);
	}
}

Main.displayName = "Utilities Page";
