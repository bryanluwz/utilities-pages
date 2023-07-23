import { Component } from "react";
import { ContentDisplay } from "../components/others/";
import { UtilitiesPageBase64Encoder } from "./UtilitiesPageBase64Encoder";
import { UtilitiesPageImageConverter } from "./UtilitiesPageImageConverter";
import SearchBar from "../components/others/Searchbar";

export default class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allUtilities: {
				"UtilitiesPageEncoder": UtilitiesPageBase64Encoder,
				"UtilitiesPageImageConverter": UtilitiesPageImageConverter
			}
		};
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
				<SearchBar
					placeholder={"Search"}
					dictionary={this.state.allUtilities}
					setSortedDictionary={(sorted) => { this.setState({ allUtilities: sorted }); }}
				/>
				{Object.keys(this.state.allUtilities).map((key, index) => {
					const Tag = this.state.allUtilities[key];
					return (
						<Tag key={index} />
					);
				})}
				<div style={{ height: "10px" }} />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Utilities Page";
