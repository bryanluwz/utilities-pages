import { Component } from "react";
import { ContentDisplay } from "../components/others/";
import { UtilitiesPageEncoder } from "./UtilitiesPageEncoder";
import { UtilitiesPageConverter } from "./UtilitiesPageConverter";

export default class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allUtilities: {}
		};

	}

	componentDidMount() {
	}

	render() {
		return (
			<ContentDisplay
				backButtonRedirect={"https://bryanluwz.github.io/#/extras-stuff"}
				displayName={Main.displayName}
				displayClearHistory={false}
				faIcon={"fa-trash"}
				contentBodyAdditionalClasses={["utils-page-wrapper"]}
				router={this.props.router}
				handleHeaderTitleClick={() => { }}
			>
				<UtilitiesPageEncoder />
				<UtilitiesPageConverter />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Utilities Page";
