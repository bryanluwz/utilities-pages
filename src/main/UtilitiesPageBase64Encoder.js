import { Component, createRef, Fragment } from "react";


export class UtilitiesPageBase64Encoder extends Component {
	constructor(props) {
		super(props);

		this.title = "Base64 Encoder";
		this.description = "Convert files to Base64 string";

		this.inputFileTypeRef = createRef();
		this.extraInfoLabelRef = createRef();
		this.imgDropZone = createRef();

		this.inputFile = null;
		this.inputFileName = null;
		this.outputText = null;

		this.state = {
			isConverting: false,
			isError: false,
			copyTextInfo: "Click here to copy",
			pasteText: "Paste",
			isClipboardApiSupported: this.isClipboardApiSupported()
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

		this.imgDropZone.current.addEventListener("dragover", this.handleDragOver);
		this.imgDropZone.current.addEventListener("drop", this.handleDrop);
	}

	// I can cheese copy but not paste, so just disable for safari lol
	isClipboardApiSupported = () => {
		return !!navigator.clipboard && typeof navigator.clipboard.read === 'function';
	};

	handleDragOver = (event) => {
		event.preventDefault();
	};

	handleDrop = (event) => {
		event.preventDefault();
		var file = event.dataTransfer?.files[0];

		if (file) {
			this.inputFile = file;
			this.inputFileName = file.name;
			this.inputFileTypeRef.current.innerHTML = "Input: <b>" + this.inputFileName + "</b>";
			this.inputFileUrl = URL.createObjectURL(this.inputFile);
			this.forceUpdate();
		}
	};
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

	handlePaste = () => {
		if (!this.state.isClipboardApiSupported) {
			this.setState({ pasteText: "Paste not supported on this device. SAD :(" },
				() => {
					setTimeout(() => {
						this.setState({ pasteText: "Do not paste 😠" });
					}, 2000);
				});
			return;
		}

		// Read image from clipboard
		navigator.clipboard.read()
			.then(clipboardItems => {
				clipboardItems.forEach(clipboardItem => {
					clipboardItem.types.forEach(type => {
						if (type.startsWith("image/")) {
							const imageFormat = type.substring(6);
							clipboardItem.getType(`image/${imageFormat}`).then(blob => {
								// Here, blob is the actual image data
								this.inputFile = blob;
								this.inputFileName = "Clipboard Image";
								this.inputFileTypeRef.current.innerHTML = "Input: <b>" + this.inputFileName + "</b>";
								this.inputFileUrl = URL.createObjectURL(this.inputFile);
								this.forceUpdate();
							});
						}
					});
				});
			}
			)
			.catch(err => {
				console.log(err);
			});
	};


	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					{this.title}
				</div>
				<div className="utils-description">
					{this.description}
				</div>
				<div className="ui-flex-column" ref={this.imgDropZone}>
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
						<button className="ui-button" onClick={this.handlePaste}>
							{this.state.pasteText}
						</button>
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
								<Fragment /> :
								this.state.isError ?
									"Oops... something went wrong with the conversion" :
									this.outputText ?
										<Fragment>
											<div className="ui-text-title" >
												<i style={{ cursor: "pointer" }} onClick={() => {
													// iOS doesn't support navigator.clipboard.writeText
													// navigator.clipboard.writeText(this.outputText);

													const textToCopy = this.outputText;

													const tempInput = document.createElement('input');
													tempInput.value = textToCopy;
													document.body.appendChild(tempInput);
													tempInput.select();

													document.execCommand('copy');

													document.body.removeChild(tempInput);

													this.setState({ copyTextInfo: "Copied!" },
														() => {
															setTimeout(() => {
																this.setState({ copyTextInfo: "Click here to copy" });
															}, 1000);
														});
												}}>
													{this.state.copyTextInfo}
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

UtilitiesPageBase64Encoder.displayName = "Base64 Encoder";
UtilitiesPageBase64Encoder.title = "Base64 Encoder";
UtilitiesPageBase64Encoder.description = "Convert files to Base64 string";