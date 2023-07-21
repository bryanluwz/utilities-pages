import { Component, createRef, Fragment } from "react";


export class UtilitiesPageEncoder extends Component {
	constructor(props) {
		super(props);

		this.inputFileTypeRef = createRef();
		this.extraInfoLabelRef = createRef();

		this.inputFile = null;
		this.inputFileName = null;
		this.outputText = null;

		this.state = {
			isConverting: false,
			isError: false
		};

		this.reader = null;
	}

	componentDidMount() {
		this.reader = new FileReader();
		this.reader.onloadend = () => {
			const base64String = this.reader.result.split(',')[1]; // Extract the Base64 string from Data URL
			this.outputText = base64String;
			this.setState({ isConverting: false, isError: false });
		};
		this.reader.onerror = () => {
			this.outputText = null;
			this.setState({ isConverting: false, isError: true });
		};
	}

	handleConvertButtonClick = async () => {
		if (this.state.isConverting || this.inputFile === null) {
			return;
		}

		this.setState({ isConverting: true, isError: false });

		this.reader.readAsDataURL(this.inputFile);
	};

	handleFileUpload = (event) => {
		let inputFileName = event.target?.files[0]?.name;
		inputFileName = inputFileName ? inputFileName : "None";
		this.inputFileName = inputFileName;
		this.inputFileTypeRef.current.innerHTML = "Input: <b>" + inputFileName + "</b>";
		this.inputFile = event.target.files[0];
	};

	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					Anything to Base64 Encoder
				</div>
				<div className="utils-description">
					Convert files to Base64 string
				</div>
				<div className="ui-flex-column">
					<div className="ui-flex-row">
						<label className="ui-file-input-wrapper">
							<div>Upload File</div>
							<input
								type="file"
								id="file-input"
								onChange={this.handleFileUpload}
							/>
						</label>
						<div ref={this.inputFileTypeRef}>
							Input: None
						</div>
					</div>

					<button
						className={`ui-button ${this.state.isConverting ? 'ui-button-disabled' : ''}`}
						id="convert-button"
						onClick={this.handleConvertButtonClick}
					>
						Convert
					</button>
					<div className="ui-extra-info" ref={this.extraInfoLabelRef}>
						{
							this.state.isConverting ?
								"Converting..." :
								this.state.isError ?
									"Oops... something went wrong with the conversion" :
									this.outputText ?
										<Fragment>
											<div className="ui-text-title" >
												<i style={{ cursor: "pointer" }} onClick={() => {
													navigator.clipboard.writeText(this.outputText);
												}}>
													Click here to copy
												</i>
											</div>
											<div className="ui-text-output">
												{this.outputText.length > 100 ? this.outputText.substring(0, 100) + " ... " + this.outputText.slice(-20) : this.outputText}
											</div>
										</Fragment> :

										<Fragment />
						}
					</div>
				</div>
			</div>
		);
	}
};
