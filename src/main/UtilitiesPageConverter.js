import { Component, Fragment, createRef } from "react";

export class UtilitiesPageConverter extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	handleConvertButtonClick = async () => {

	};

	handleFileUpload = (event) => {
		let inputFileName = event.target?.files[0]?.name;
		inputFileName = inputFileName ? inputFileName : "None";
		this.inputFileName = inputFileName;
		this.inputFileTypeRef.current.innerHTML = "Input: " + inputFileName;
		this.inputFile = event.target.files[0];
	};

	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					Emotional Support
				</div>
				<div className="utils-description">
					This section here is just for EMOTIONAL SUPPORT
				</div>

			</div>
		);
	}
};
