import { Component } from "react";
import { ContentDisplay } from "../components/others/";
import { UtilitiesPageFfmpegConversion } from "./UtilitiesPage";

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
				contentBodyAdditionalClasses={[]}
				router={this.props.router}
				handleHeaderTitleClick={() => { }}
			>
				<UtilitiesPageFfmpegConversion />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Utilities Page";
