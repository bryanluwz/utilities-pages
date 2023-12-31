import { Component, Fragment, createRef } from "react";

import { BrowserMultiFormatReader } from "@zxing/browser";

export class UtilitiesPageCodeReader extends Component {
	constructor(props) {
		super(props);

		this.title = "Code Reader";
		this.description = "Reads different kind of code formats";

		this.inputFileTypeRef = createRef();
		this.extraInfoLabelRef = createRef();

		this.inputFile = null;
		this.inputFileName = null;
		this.inputFileUrl = null;

		this.reader = null;
		this.codeReader = null;

		this.state = {
			convertFileTypeSelectArrowIsRotated: false,
			isConverting: false,
			isConvertingAllowed: true,
			isError: false,
			copyTextInfo: "Click here to copy",
			pasteText: "Paste",
			isClipboardApiSupported: this.isClipboardApiSupported()
		};

		this.imgDropZone = createRef();
	}

	componentDidMount() {
		this.codeReader = new BrowserMultiFormatReader();

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

		this.codeReader.decodeFromImageUrl(this.inputFileUrl, this.inputFile.width, this.inputFile.height)
			.then(result => {
				this.outputText = result.text;
				this.setState({ isConverting: false, isError: false });
			})
			.catch(err => {
				this.outputText = null;
				this.setState({ isConverting: false, isError: true });
			});
	};

	handleFileUpload = (event) => {
		let inputFileName = event.target?.files[0]?.name;
		inputFileName = inputFileName ? inputFileName : "None";
		this.inputFileName = inputFileName;
		this.inputFileTypeRef.current.innerHTML = "Input: <b>" + inputFileName + "</b>";
		this.inputFile = event.target.files[0];
		this.inputFileUrl = URL.createObjectURL(this.inputFile);
		this.forceUpdate();
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

					<img src={this.inputFileUrl} alt="" />

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
									"Are you sure this is a code? 🤔" :
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

UtilitiesPageCodeReader.displayName = "Code Reader";
UtilitiesPageCodeReader.title = "Code Reader";
UtilitiesPageCodeReader.description = "Reads different kind of code formats";