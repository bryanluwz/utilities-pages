import { Component } from "react";
import { ContentDisplay } from "../components/others/";
import UtilitiesPageBox, { UtilitiesPageFfmpegConversion } from "./UtilitiesPage";

export default class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allUtilities: {}
		};

	}

	componentDidMount() {
		(async () => {
			const allUtilities = await require("./utilitiesPage.json");
			this.setState({ allUtilities });
		})();
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
				{/* Container for each section */}
				{/* Each section will be one conversion category, e.g. ffmpeg supported conversion */}
				{/* {
					Object.entries(this.state.allUtilities).map(([_, utility], index) => {
						return (
							<UtilitiesPageBox
								onButtonClick={() => { }}
								title={utility.title}
								description={utility.description}
								ui={utility.ui}
								key={index}
							>
							</UtilitiesPageBox>
						);
					}
					)
				} */}
				<UtilitiesPageFfmpegConversion />
			</ContentDisplay>
		);
	}
}

Main.displayName = "Utilities Page";
